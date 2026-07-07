# What Is a Micro-Frontend

Micro-frontends take the ideas behind backend microservices and apply them to the frontend: a large frontend application is split into several smaller apps that can be developed and deployed independently, then composed into a complete product at runtime.

The term first showed up in the 2016 ThoughtWorks Technology Radar. The underlying need is simple enough — when a frontend project grows too big for one team to handle, you need a way to break it apart.

## Why You Might Need It

Most frontend projects start out as a single repository, a single tech stack, and a single team, because that's the least hassle. The problems grow in over time:

- The codebase keeps getting bigger, so new people take a long time to grasp the whole thing, and the blast radius of any single change gets harder to judge.
- As more people pile in, everyone shares one release pipeline. Anyone who wants to ship has to wait in line, and worries about breaking everyone else.
- The tech stack is nailed down the day the project starts. The framework you picked three years ago is the one you'd like to replace today, only to find that pulling one thread moves the whole thing.
- Sometimes you also have to live with legacy baggage — an old AngularJS system you want to migrate to React piece by piece, without being able to stop and rewrite it.

None of these are purely technical problems; they're mostly about **organization and collaboration**. The micro-frontend answer is to split the application into independent parts along team and business lines, so each part gets to call its own shots.

## The Core Ideas

Micro-frontend approaches differ a lot in how they're implemented, but they broadly agree on a few points:

- **Independent development and deployment.** Each micro-app has its own repository, its own build, and its own release cadence. Changing one app doesn't require rebuilding and redeploying the others.
- **Tech-stack agnostic.** The main app shouldn't dictate which framework a micro-app uses. React, Vue, Angular, even plain HTML can coexist, and a new app doesn't have to accommodate an old one's choices.
- **Runtime integration, not build-time integration.** The apps are assembled together in the browser, not stuffed into the same bundle at packaging time. That's what makes independent deployment possible in the first place.
- **Isolation from each other.** One app's styles, global variables, and runtime errors shouldn't affect another. This is the precondition for having multiple apps share a single page.

## It's Not a Silver Bullet

Micro-frontends solve problems caused by **scale**, and the price is added complexity: a runtime for loading and isolation, cross-app communication conventions, and duplicated dependencies.

So if one team can comfortably maintain your application and a single tech stack is enough, you probably don't need micro-frontends — plain routing plus code splitting is simpler. The split only pays off once your application's boundaries start to line up with **team boundaries and deployment boundaries**, where the gains genuinely outweigh the cost.

## Where qiankun Fits In

Micro-frontends are just an architectural idea; putting one into practice takes a concrete runtime. [qiankun](/guide/what-is-qiankun) is one such framework: it loads each micro-app from its own HTML entry, gives it an isolated runtime environment, and mounts and unmounts it at the right moments. What framework each micro-app uses internally, and how it's built, is none of qiankun's concern.

If you've considered using an iframe for isolation, read [Why Not iframe](/guide/why-not-iframe) first — it's a pit a lot of people have fallen into.
