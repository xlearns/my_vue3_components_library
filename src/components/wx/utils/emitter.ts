import { getCurrentInstance } from 'vue'
import mitt from 'mitt'

const DISPATCH = 'dispatch'
const BROADCAST = 'broadcast'

const wrapper = Symbol('wrapper')

const emitter = mitt()

export function useEmitter() {
  const currentComponentInstance = getCurrentInstance()

  function on(type:any, handler:any) {
    const handleWrapper = (e:any) => {
      const { value, type, emitComponentInstance } = e
      if (type === BROADCAST) {
        if (isChildComponent(currentComponentInstance, emitComponentInstance)) {
          handler && handler(...value)
        }
      } else if (type === DISPATCH) {
        if (isChildComponent(emitComponentInstance, currentComponentInstance)) {
          handler && handler(...value)
        }
      } else {
        handler && handler(...value)
      }
    }

    // Save the real handler because the need to call off
    handler[wrapper] = handleWrapper
    emitter.on(type, handleWrapper)
  }

  function broadcast(type:any, ...args:any) {
    emitter.emit(type, {
      type: BROADCAST,
      emitComponentInstance: currentComponentInstance,
      value: args
    })
  }

  function dispatch(type:any, ...args:any) {
    emitter.emit(type, {
      type: DISPATCH,
      emitComponentInstance: currentComponentInstance,
      value: args
    })
  }

  function off(type:any, handler:any) {
    emitter.off(type, handler[wrapper])
  }

  function once(type:any, handler:any) {
    const handleOn = (...args:any) => {
      handler && handler(...args)
      off(type, handleOn)
    }
    on(type, handleOn)
  }

  return {
    on,
    broadcast,
    dispatch,
    off,
    once
  }
}

/**
 * check componentChild is componentParent child components
 * @param {*} componentChild
 * @param {*} componentParent
 */
function isChildComponent(componentChild:any, componentParent:any) {
  const parentUId = componentParent.uid

  while (componentChild && componentChild?.parent?.uid !== parentUId) {
    componentChild = componentChild.parent
  }

  return Boolean(componentChild)
}
