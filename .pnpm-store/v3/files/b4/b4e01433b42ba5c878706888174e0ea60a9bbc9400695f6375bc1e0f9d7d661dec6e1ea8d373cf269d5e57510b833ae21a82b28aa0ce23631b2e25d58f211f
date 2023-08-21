<div align="center">
<h1>react-error-boundary</h1>

<p>Simple reusable React error boundary component</p>
</div>

---

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## The problem

React [v16](https://reactjs.org/blog/2017/09/26/react-v16.0.html) introduced the
concept of [“error boundaries”](https://reactjs.org/docs/error-boundaries.html).

## This solution

This component provides a simple and reusable wrapper that you can use to wrap
around your components. Any rendering errors in your components hierarchy can
then be gracefully handled.

Reading this blog post will help you understand what react-error-boundary does
for you:
[Use react-error-boundary to handle errors in React](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)
– How to simplify your React apps by handling React errors effectively with
react-error-boundary

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Error Recovery](#error-recovery)
- [API](#api)
  - [`ErrorBoundary` props](#errorboundary-props)
  - [`useErrorHandler(error?: unknown)`](#useerrorhandlererror-unknown)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-error-boundary
```

## Usage

The simplest way to use `<ErrorBoundary>` is to wrap it around any component
that may throw an error. This will handle errors thrown by that component and
its descendants too.

```jsx
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const ui = (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // reset the state of your app so the error doesn't happen again
    }}
  >
    <ComponentThatMayError />
  </ErrorBoundary>
)
```

You can react to errors (e.g. for logging) by providing an `onError` callback:

```jsx
import {ErrorBoundary} from 'react-error-boundary'

const myErrorHandler = (error: Error, info: {componentStack: string}) => {
  // Do something with the error
  // E.g. log to an error logging client here
}

const ui = (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
    <ComponentThatMayError />
  </ErrorBoundary>,
)
```

You can also use it as a
[higher-order component](https://reactjs.org/docs/higher-order-components.html):

```jsx
import {withErrorBoundary} from 'react-error-boundary'

const ComponentWithErrorBoundary = withErrorBoundary(ComponentThatMayError, {
  FallbackComponent: ErrorBoundaryFallbackComponent,
  onError(error, info) {
    // Do something with the error
    // E.g. log to an error logging client here
  },
})

const ui = <ComponentWithErrorBoundary />
```

### Error Recovery

In the event of an error if you want to recover from that error and allow the
user to "try again" or continue with their work, you'll need a way to reset the
ErrorBoundary's internal state. You can do this various ways, but here's the
most idiomatic approach:

```jsx
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function Bomb() {
  throw new Error('💥 CABOOM 💥')
}

function App() {
  const [explode, setExplode] = React.useState(false)
  return (
    <div>
      <button onClick={() => setExplode(e => !e)}>toggle explode</button>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setExplode(false)}
        resetKeys={[explode]}
      >
        {explode ? <Bomb /> : null}
      </ErrorBoundary>
    </div>
  )
}
```

So, with this setup, you've got a button which when clicked will trigger an
error. Clicking the button again will trigger a re-render which recovers from
the error (we no longer render the `<Bomb />`). We also pass the `resetKeys`
prop which is an array of elements for the `ErrorBoundary` to check each render
(if there's currently an error state). If any of those elements change between
renders, then the `ErrorBoundary` will reset the state which will re-render the
children.

We have the `onReset` prop so that if the user clicks the "Try again" button we
have an opportunity to re-initialize our state into a good place before
attempting to re-render the children.

This combination allows us both the opportunity to give the user something
specific to do to recover from the error, and recover from the error by
interacting with other areas of the app that might fix things for us. It's hard
to describe here, but hopefully it makes sense when you apply it to your
specific scenario.

## API

### `ErrorBoundary` props

#### `children`

This is what you want rendered when everything's working fine. If there's an
error that React can handle within the children of the `ErrorBoundary`, the
`ErrorBoundary` will catch that and allow you to handle it gracefully.

#### `FallbackComponent`

This is a component you want rendered in the event of an error. As props it will
be passed the `error` and `resetErrorBoundary` (which will reset the error
boundary's state when called, useful for a "try again" button when used in
combination with the `onReset` prop).

This is required if no `fallback` or `fallbackRender` prop is provided.

#### `fallbackRender`

This is a render-prop based API that allows you to inline your error fallback UI
into the component that's using the `ErrorBoundary`. This is useful if you need
access to something that's in the scope of the component you're using.

It will be called with an object that has `error` and `resetErrorBoundary`:

```jsx
const ui = (
  <ErrorBoundary
    fallbackRender={({error, resetErrorBoundary}) => (
      <div role="alert">
        <div>Oh no</div>
        <pre>{error.message}</pre>
        <button
          onClick={() => {
            // this next line is why the fallbackRender is useful
            resetComponentState()
            // though you could accomplish this with a combination
            // of the FallbackCallback and onReset props as well.
            resetErrorBoundary()
          }}
        >
          Try again
        </button>
      </div>
    )}
  >
    <ComponentThatMayError />
  </ErrorBoundary>
)
```

I know what you're thinking: I thought we ditched render props when hooks came
around. Unfortunately, the current React Error Boundary API only supports class
components at the moment, so render props are the best solution we have to this
problem.

This is required if no `FallbackComponent` or `fallback` prop is provided.

#### `fallback`

In the spirit of consistency with the `React.Suspense` component, we also
support a simple `fallback` prop which you can use for a generic fallback. This
will not be passed any props so you can't show the user anything actually useful
though, so it's not really recommended.

```jsx
const ui = (
  <ErrorBoundary fallback={<div>Oh no</div>}>
    <ComponentThatMayError />
  </ErrorBoundary>
)
```

#### `onError`

This will be called when there's been an error that the `ErrorBoundary` has
handled. It will be called with two arguments: `error`, `info`.

#### `onReset`

This will be called immediately before the `ErrorBoundary` resets it's internal
state (which will result in rendering the `children` again). You should use this
to ensure that re-rendering the children will not result in a repeat of the same
error happening again.

`onReset` will be called with whatever `resetErrorBoundary` is called with.

**Important**: `onReset` will _not_ be called when reset happens from a change
in `resetKeys`. Use `onResetKeysChange` for that.

#### `resetKeys`

Sometimes an error happens as a result of local state to the component that's
rendering the error. If this is the case, then you can pass `resetKeys` which is
an array of values. If the `ErrorBoundary` is in an error state, then it will
check these values each render and if they change from one render to the next,
then it will reset automatically (triggering a re-render of the `children`).

See the recovery examples above.

#### `onResetKeysChange`

This is called when the `resetKeys` are changed (triggering a reset of the
`ErrorBoundary`). It's called with the `prevResetKeys` and the `resetKeys`.

### `useErrorHandler(error?: unknown)`

React's error boundaries feature is limited in that the boundaries can only
handle errors thrown during React's lifecycles. To quote
[the React docs on Error Boundaries](https://reactjs.org/docs/error-boundaries.html):

> Error boundaries do not catch errors for:
>
> - Event handlers
>   ([learn more](https://reactjs.org/docs/error-boundaries.html#how-about-event-handlers))
> - Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
> - Server side rendering
> - Errors thrown in the error boundary itself (rather than its children)

This means you have to handle those errors yourself, but you probably would like
to reuse the error boundaries you worked hard on creating for those kinds of
errors as well. This is what `useErrorHandler` is for.

There are two ways to use `useErrorHandler`:

1. `const handleError = useErrorHandler()`: call `handleError(theError)`
2. `useErrorHandler(error)`: useful if you are managing the error state yourself
   or get it from another hook.

Here's an example:

```javascript
import { useErrorHandler } from 'react-error-boundary'

function Greeting() {
  const [greeting, setGreeting] = React.useState(null)
  const handleError = useErrorHandler()

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.target.elements.name.value
    fetchGreeting(name).then(
      newGreeting => setGreeting(newGreeting),
      handleError,
    )
  }

  return greeting ? (
    <div>{greeting}</div>
  ) : (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input id="name" />
      <button type="submit">get a greeting</button>
    </form>
  )
}
```

> Note, in case it's not clear what's happening here, you could also write
> `handleSubmit` like this:

```javascript
function handleSubmit(event) {
  event.preventDefault()
  const name = event.target.elements.name.value
  fetchGreeting(name).then(
    newGreeting => setGreeting(newGreeting),
    error => handleError(error),
  )
}
```

Alternatively, let's say you're using a hook that gives you the error:

```javascript
import { useErrorHandler } from 'react-error-boundary'

function Greeting() {
  const [name, setName] = React.useState('')
  const {greeting, error} = useGreeting(name)
  useErrorHandler(error)

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.target.elements.name.value
    setName(name)
  }

  return greeting ? (
    <div>{greeting}</div>
  ) : (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input id="name" />
      <button type="submit">get a greeting</button>
    </form>
  )
}
```

In this case, if the `error` is ever set to a truthy value, then it will be
propagated to the nearest error boundary.

In either case, you could handle those errors like this:

```javascript
const ui = (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Greeting />
  </ErrorBoundary>
)
```

And now that'll handle your runtime errors as well as the async errors in the
`fetchGreeting` or `useGreeting` code.

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/github/workflow/status/bvaughn/react-error-boundary/validate?logo=github&style=flat-square
[build]: https://github.com/bvaughn/react-error-boundary/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/bvaughn/react-error-boundary.svg?style=flat-square
[coverage]: https://codecov.io/github/bvaughn/react-error-boundary
[version-badge]: https://img.shields.io/npm/v/react-error-boundary.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-error-boundary
[downloads-badge]: https://img.shields.io/npm/dm/react-error-boundary.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/react-error-boundary
[license-badge]: https://img.shields.io/npm/l/react-error-boundary.svg?style=flat-square
[license]: https://github.com/bvaughn/react-error-boundary/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: https://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/bvaughn/react-error-boundary/blob/master/CODE_OF_CONDUCT.md
[bugs]: https://github.com/bvaughn/react-error-boundary/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/bvaughn/react-error-boundary/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/bvaughn/react-error-boundary/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->
