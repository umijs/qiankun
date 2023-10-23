import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#1: Application died in status NOT_MOUNTED: Target container with #container not existed after {props.getErrorCodeArg(0)} mounted!</h1>
            <p>
                This error thrown as the container DOM does not exist after the micro app is loaded. The possible reasons are:
            </p>
            <h4>
                1.The root id of the micro app conflicts with other DOM, and the solution is to modify the search range of the root id.
            </h4>
            <div>
                <h4>vue micro app:</h4>
                <CodeSnippet>
                    {`
                        function render(props = {}) {
                            const { container } = props;
                            instance = new Vue({
                            router,
                            store,
                            render: (h) => h(App),
                            }).$mount(container ? container.querySelector('#app') : '#app');
                        }
                        export async function mount(props) {
                            render(props);
                        }
                    `}
                </CodeSnippet>
                <h4>react micro app:</h4>
                <CodeSnippet>
                    { `
                        function render(props) {
                            const { container } = props;
                            ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
                          }
                        export async function mount(props) {
                            render(props);
                        }
                        export async function unmount(props) {
                            const { container } = props;
                            ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
                        }
                    `}
                </CodeSnippet>
            </div>
            <h2>Explanation:</h2>
            <p>
                <a href="/qiankun/faq#application-died-in-status-not_mounted-target-container-with-container-not-existed-after-xxx-mounted">FAQ</a> 
            </p>
        </>
    )
}