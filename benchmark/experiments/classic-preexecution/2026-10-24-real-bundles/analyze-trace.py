import json,glob,collections,os
from pathlib import Path
base=Path(__file__).parent
root=sorted(base.glob('trace-*'))[-1]
output=[]
for work in ['synthetic-5m','mermaid','react-cytoscape']:
 for arm in ['a','factory']:
  p=max(root.glob('*'+work+'-'+arm+'-v8.log'),key=lambda p:p.stat().st_size)
  lines=[l.rstrip().split(',') for l in p.open()]
  rows=[r for r in lines if r[0]=='function']
  ids=collections.Counter(r[2] for r in rows)
  # Payload has most function events in these samples; verify byte extent below.
  target=max(ids,key=ids.get)
  maxpos=max(int(r[4]) for r in rows if r[2]==target)
  if maxpos<500000:raise Exception('Missing payload')
  stub=int(target)+1
  cut=next((int(r[3])for r in lines if r[:3]==['script','reserve-id',str(stub)]),float('inf')) if arm=='factory' else 0
  selected=[r for r in rows if r[2]==target]
  stages={}
  for stage,predicate in [('preparation',lambda r:int(r[6])<cut),('activation_and_later',lambda r:int(r[6])>=cut)]:
   rs=[r for r in selected if predicate(r)]
   counters=collections.Counter(r[1] for r in rs)
   durations={k:round(sum(float(r[5])for r in rs if r[1]==k),3)for k in counters}
   stages[stage]={'counts':dict(counters),'eventDurationMs':durations,'earlyInterpreters':[{'start':int(r[3]),'end':int(r[4]),'name':','.join(r[7:])}for r in rs if r[1]=='interpreter'][:10] if stage=='preparation' else []}
  ev=json.load(open(root/(work+'-1-'+arm+'-trace.json')))['traceEvents']
  marks={e['name']:e['ts'] for e in ev if e['name'] in ['experiment-start','registration-start','registration-end','activation-start','business-start','business-end','render-start','render-end','stable-paint']}
  main=next(e['tid']for e in ev if e['name']=='activation-start')
  trace={}
  for stage,start,end in [('prepare',marks['experiment-start'],marks['activation-start']),('activation_to_paint',marks['activation-start'],marks['stable-paint'])]:
   trace[stage]={}
   for n in ['V8.CompileCode','V8.ParseFunction','V8.PreParse','V8.CompileIgnition','v8.parseOnBackground','v8.compile','V8.CompileCodeBackground']:
    items=[e for e in ev if e['name']==n and start<=e['ts']<end]
    trace[stage][n]={'ms':round(sum(e.get('dur',0) for e in items)/1000,3),'count':len(items),'mainThreadMs':round(sum(e.get('dur',0)for e in items if e['tid']==main)/1000,3)}
  output.append({'workload':work,'arm':arm,'scriptId':target,'payloadMaxPosition':maxpos,'functionEvents':stages,'trace':trace,'marks':marks})
(root/'analysis.json').write_text(json.dumps(output,indent=2))
for r in output:
 print(r['workload'],r['arm'])
 for stage,v in r['functionEvents'].items():print(stage,v['counts'],{k:v['eventDurationMs'].get(k) for k in ['preparse-resolution','parse','full-parse','parse-function','interpreter']})
 print('EARLY',r['functionEvents']['preparation']['earlyInterpreters'])
