import {
  Dispatch,
  SetStateAction,
  useState,
  type DependencyList,
  useEffect,
} from "react"
import { useDebounce } from "usehooks-ts"
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
