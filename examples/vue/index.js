/**
 * @author 有知 <youzhi.lk@antfin.com>
 * @since 2019-05-16
 */
import Vue from 'vue';
import App from './App';
import './index.css';

let instance = null;

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  instance = new Vue({
    el: '#vueRoot',
    render: h => h(App),
  });
}

export async function unmount() {
  instance.$destroy();
  instance = null;
}
