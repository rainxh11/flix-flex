import {
  Dispatch,
  SetStateAction,
  useState,
  type DependencyList,
  useEffect,
  useRef,
  MutableRefObject,
  useMemo,
} from "react"
import { useDebounce, useInterval } from "usehooks-ts"
import { useCallback } from "react"
import { debounce, random } from "lodash"
import { DebouncedFunc } from "lodash"
import { sha1 } from "object-hash"

export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
): T | undefined
export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
  initial: T,
): T
export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
  initial?: T,
) {
  const [val, setVal] = useState<T | undefined>(initial)
  useEffect(() => {
    let cancel = false
    const promise = factory()
    if (promise === undefined || promise === null) return
    promise.then(val => {
      if (!cancel) {
        setVal(val)
      }
    })
    return () => {
      cancel = true
    }
  }, deps)
  return val
}

export function useCallbackDebounced<TFunction extends (...args: any[]) => any>(
  callback: TFunction,
  delay: number,
  deps?: DependencyList,
): DebouncedFunc<TFunction> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(callback, delay), deps ?? [])
}

export function usePromiseLoading<
  TPromise extends (...args: any[]) => Promise<unknown> | Promise<void>,
>(
  fn: TPromise,
): [
  fn: () => Promise<void>,
  {
    isLoading: boolean
    errors?: unknown
    reset: () => void
  },
] {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<unknown>(null)
  return [
    async () => {
      setIsLoading(true)
      await fn()
        .catch(error => setErrors(error))
        .finally(() => setIsLoading(false))
    },
    {
      isLoading,
      errors,
      reset: () => {
        setErrors(null)
        setIsLoading(false)
      },
    },
  ]
}

export function useStateDebounced<T>(
  initialValue: T,
  delay: number = 500,
): [debouncedState: T, state: T, setState: Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue)
  const debounced = useDebounce(state, delay)

  return [debounced, state, setState]
}

export function useToggleRefState<T>(
  initialValue?: T,
): [
  state: T | undefined,
  toggle: () => void,
  ref: MutableRefObject<T | undefined>,
] {
  const internalRef = useRef<T | undefined>(initialValue ?? undefined)
  const [refState, setRefState] = useState<T | undefined>()

  return [
    refState,
    () => setRefState(v => (!v ? internalRef.current : undefined)),
    internalRef,
  ]
}

export function useRandomKey(): [key: Readonly<string>, randomize: () => void] {
  const [state, setState] = useState<string>((Math.random() * 1000).toString())
  return [
    state,
    () => {
      setState((Math.random() * 1000).toString())
    },
  ]
}

export const useComputed = <T>(
  getter: (previousState?: T) => T,
  deps: DependencyList,
): T => {
  const [state, setState] = useState<T>(getter())
  const hash = useMemo(() => sha1({ deps: deps }), [deps])
  useEffect(() => {
    setState(v => getter(v))
  }, [hash])

  return state
}

export const useIntervalComputed = <T>(
  getter: (previousState?: T) => T,
  deps: DependencyList,
  updateInterval?: number,
): T => {
  const [internalState, setState] = useState<T>(getter())
  const [cachedState, setCachedState] = useState<T>(internalState)
  const [triggerState, setTriggerState] = useState<number>(0)

  useEffect(() => {
    setState(v => {
      const currentHash = sha1({ value: v })
      const newValue = getter(v)
      const newHash = sha1({ value: newValue })
      if (currentHash === newHash) {
        setCachedState(newValue)
      }
      return newValue
    })
  }, [...deps, triggerState])
  useInterval(() => setTriggerState(random(true)), updateInterval || 1000)

  return cachedState
}
