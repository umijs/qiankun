import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom';
const Hello = lazy(()=>import(/* webpackChunkName: "OtherComponent" */'./Hello'));
/**
 * 渲染子应用
 */
class Render extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHello: false
    };
  }

  componentDidMount() {
    window.sayHello = (msg)=>{
      this.setState({
        showHello: true,
        msg: msg || '什么都没有'
      });
    }
  }

  render() {
    const { loading } = this.props;
    const { msg } = this.state
    return (
      <>
        {loading && <h4 className="subapp-loading">Loading...</h4>}
        <Suspense fallback={<div>Loading...</div>}>
          {this.state.showHello && <Hello msg={msg} />}
        </Suspense>
        <div id="subapp-viewport" />
      </>
    );
  }
}

export default function render({ loading }) {
  const container = document.getElementById('subapp-container');
  ReactDOM.render(<Render loading={loading} />, container);
}
