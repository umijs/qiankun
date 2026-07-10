# Runtime internals

This section explains how qiankun v3 is implemented. It is intended for contributors, maintainers, and readers debugging behavior that cannot be understood from the public contract alone.

You do not need these pages to integrate a micro-app. Start with [Loading a micro-app instance](/concepts/architecture), then use the [guides](/cookbook/) and [API reference](/api/) for supported behavior.

## Topics

- [Runtime orchestration](/internals/runtime-orchestration): how the public loading APIs connect the loader, sandbox, and lifecycle pipeline.
- [Lifecycle resolution](/internals/lifecycle-resolution): how Classic and ESM exports become a lifecycle object.
- [Streaming HTML Entry](/internals/streaming-html-entry): streams, DOM submission, head virtualization, and asset transformation.
- [JavaScript sandbox](/internals/js-sandbox): the membrane, compartment, patchers, and multi-instance state.
- [Style isolation](/internals/style-isolation): CSS transformation, external stylesheets, and runtime CSSOM handling.
- [ESM sandbox](/internals/esm-sandbox): module rewriting, runtime import maps, evaluation order, and realm cleanup.

## Stability

Names, source paths, and control flow in this section are implementation details. They may change without a public API deprecation. Build integrations against documented APIs and observable behavior, not these internals.

Design rationale that should outlive a particular implementation belongs in the [RFCs](https://github.com/umijs/qiankun/tree/next/docs/rfcs).
