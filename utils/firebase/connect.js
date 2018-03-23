import React, { Component } from 'react';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import map from 'lodash/map';

import firebaseShape from './shape';

/*
  In a fashion similar to react-redux `connect`, `firebaseConnect`
  is a High-order Component that adds to the properties it receives
  from ancestor components properties created from data fetched from a Firebase database.
  It returns a function that can be applied to the base component to be wrapped
  and returns the wrapped component.

  It takes a single argument:

  * `firebaseDataMap`: a function that receives the properties from the components
    higher up in the hierarchy and returns a mapping object whose keys are the
    names of the properties to be produced. The special `$` property name 
    can be used to signal that the values can bemerged directly into the 
    properties using their own names.
    The mapping object values can be either:

    * a string representing the path to the value to be retrieved from Firebase.
    * an object containing the following properties:

      * `path`: a string representing the path to the value to be retrieved
      * `eventType`: one of "value", "child_added", "child_changed",
          "child_removed", or "child_moved". defaults to "value"
      * `fn`: a function that will receive the data fetched and should return
        whatever it is to be stored in the property.
        If the eventType is any of the *child_xxxx* ones, `fn` will receive
        a second argument as described in the
        [reference](https://firebase.google.com/docs/reference/js/firebase.database.Reference#on)

    `firebaseConnect` will set value listeners on these references and will
    refresh the base component when the value changes.

```js
const firebaseDataMap = (props) => ({
  valueXxx: `path/subPath/${props.xxx}`, // simple form with path
  listXxx: {
    path: 'path/someList',
    fn: result => result.map(value => value.item1),
  }
})

export default firebaseConnect(firebaseDataMap)(BaseComponent);
```
*/
const firebaseConnect = firebaseDataMap => BaseComponent => {
  const FirebaseConnect = class extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {};
      this.firebase = context.firebase;
      this.subscriptions = [];
    }
    componentDidMount() {
      const database = this.firebase.database();
      const dataMap = firebaseDataMap(this.props);
      if (dataMap && typeof dataMap === 'object') {
        this.subscriptions = map(dataMap, (path, prop) => {
          switch (typeof path) {
            case 'string': {
              const callback = snapshot => {
                this.setState(
                  prop === '$' ? snapshot.val() : { [prop]: snapshot.val() },
                );
              };
              database.ref(path).on('value', callback);
              return {
                path,
                eventType: 'value',
                callback,
              };
            }
            case 'object': {
              if (!path) return null;
              const callback = (snapshot, key) => {
                this.setState(
                  prop === '$'
                    ? path.fn(snapshot.val(), key)
                    : { [prop]: path.fn(snapshot.val(), key) },
                );
              };
              database.ref(path.path).on(path.eventType || 'value', callback);
              return {
                path: path.path,
                eventType: path.eventType || 'value',
                callback,
              };
            }
            default:
              return null;
          }
        });
      }
    }
    componentWillUnmount() {
      const database = this.firebase.database();
      this.subscriptions.forEach(subs => {
        if (!subs) return;
        database.ref(subs.path).off(subs.eventType, subs.callback);
      });
    }

    render() {
      return React.createElement(
        BaseComponent,
        Object.assign({}, this.props, this.state),
      );
    }
  };
  FirebaseConnect.contextTypes = {
    firebase: firebaseShape,
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'firebaseConnect'))(
      FirebaseConnect,
    );
  }
  return FirebaseConnect;
};

export default firebaseConnect;
