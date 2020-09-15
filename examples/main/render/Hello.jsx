import React from 'react';
import './Hello.less';
/**
 * render Hello
 */
export default class Hello extends React.Component {
    render() {
        console.log('render Hello')
        const {msg} = this.props;
        return (
            <div className="react-h4">
                <h4>Hello React jsx code split, call from sub app {msg}</h4>
            </div>
        );
    }
}