import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, type AnchorHTMLAttributes } from 'vue-demi';
import { isMicroAppLinkActive, navigateMicroAppLink, subscribeToMicroAppLinkLocation } from '@qiankunjs/ui-shared';

export interface MicroAppLinkProps extends Omit<AnchorHTMLAttributes, 'href'> {
  to: string;
  replace?: boolean;
  className?: string;
  activeClassName?: string;
}

export const MicroAppLink = defineComponent<MicroAppLinkProps>({
  name: 'MicroAppLink',
  inheritAttrs: false,
  props: {
    to: { type: String, required: true },
    replace: { type: Boolean, default: false },
    className: { type: String, default: undefined },
    activeClassName: { type: String, default: undefined },
  },
  emits: {
    click: (_event: MouseEvent) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const locationHref = ref(typeof window === 'undefined' ? undefined : window.location.href);
    const active = computed(() => isMicroAppLinkActive(props.to, locationHref.value));
    let unsubscribe: (() => void) | undefined;

    onMounted(() => {
      const updateLocation = () => {
        locationHref.value = window.location.href;
      };
      updateLocation();
      unsubscribe = subscribeToMicroAppLinkLocation(updateLocation);
    });
    onBeforeUnmount(() => unsubscribe?.());

    const onClick = (event: MouseEvent) => {
      emit('click', event);
      if (event.currentTarget instanceof HTMLAnchorElement) {
        navigateMicroAppLink(event, event.currentTarget, props.replace);
      }
    };

    return () =>
      h(
        'a',
        {
          ...attrs,
          href: props.to,
          class: [attrs.class, props.className, active.value && props.activeClassName],
          onClick,
        },
        slots.default?.(),
      );
  },
});
