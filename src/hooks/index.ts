import {
  Dispatch,
  SetStateAction,
  useState,
  type DependencyList,
  useEffect,
} from "react"
import { useDebounce, useInterval } from "usehooks-ts"
import { random } from "lodash"
import { sha1 } from "object-hash"
import { useCallback } from "react"
import { debounce } from "lodash"
import { DebouncedFunc } from "lodash"

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
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  selectExpiration?: (val?: T) => number | undefined,
): [State: () => T | undefined, SetState: (val: T) => void] {
  let timeout: any = null

  const existing = localStorage.getItem(key)
  if ((!existing || existing?.length === 0) && !!initialValue) {
    localStorage.setItem(key, JSON.stringify(initialValue!))
    if (!!selectExpiration && !!selectExpiration(initialValue)) {
      if (!!timeout) clearTimeout(timeout)
      timeout = setTimeout(
        () => localStorage.removeItem(key),
        selectExpiration(initialValue)!,
      )
    }
  }
  return [
    () => {
      const item = localStorage.getItem(key)
      return !item || item?.length === 0 ? undefined : (JSON.parse(item!) as T)
    },
    val => {
      localStorage.setItem(key, JSON.stringify(val))
      if (!!selectExpiration && !!selectExpiration(val)) {
        if (!!timeout) clearTimeout(timeout)
        timeout = setTimeout(
          () => localStorage.removeItem(key),
          selectExpiration(val)!,
        )
      }
    },
  ]
}

export const useRetryState = <T>(
  getter: () => T,
  retryDelayMs: number,
): { loading: boolean; value?: T } => {
  const [value, setValue] = useState<T>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const firstTry = getter()
    if (!!firstTry) {
      setValue(firstTry)
      setLoading(false)
      return () => {}
    }
    const interval = setInterval(() => {
      const result = getter()
      if (!!result) {
        setValue(result)
        setLoading(false)
        clearInterval(interval)
      }
    }, retryDelayMs)

    return () => clearInterval(interval)
  }, [])

  return { loading, value }
}

export const useRetryFn = (fn: () => boolean, retryDelayMs: number) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const isSuccess = fn()
      if (isSuccess) clearInterval(interval)
    }, retryDelayMs)

    return () => clearInterval(interval)
  }, [retryDelayMs])
}

export const useAsyncRetryFn = (
  fn: () => Promise<boolean>,
  retryDelayMs: number,
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      fn().then(isSuccess => {
        if (isSuccess) clearInterval(interval)
      })
    }, retryDelayMs)

    return () => clearInterval(interval)
  }, [retryDelayMs])
}

export const useComputed = <T>(
  getter: (previousState?: T) => T,
  deps: DependencyList,
): T => {
  const [internalState, setState] = useState<T>(getter())
  const [cachedState, setCachedState] = useState<T>(internalState)
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
  }, [deps])

  return cachedState
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
  }, [deps, triggerState])
  useInterval(() => setTriggerState(random(true)), updateInterval || 1000)

  return cachedState
}
