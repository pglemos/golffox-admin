import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'

import { supabaseClient } from '../lib/supabaseClient'
import type { EntityConfig, EntityKey, FieldConfig, Option } from './entityConfigs'

type CreateEntityModalProps = {
  config: EntityConfig
  onClose: () => void
  onSubmit: ({
    entity,
    values,
    record,
    optionLabels,
    mode,
    contextId,
  }: {
    entity: EntityKey
    values: Record<string, any>
    record?: Record<string, any>
    optionLabels: Record<string, string>
    mode: 'create' | 'edit'
    contextId?: string
  }) => void
  mode?: 'create' | 'edit'
  initialValues?: Record<string, any>
  initialOptionLabels?: Record<string, string>
  initialRecord?: Record<string, any>
  contextId?: string
}

type FieldErrors = Record<string, string>

const buildInitialValues = (fields: FieldConfig[], overrides?: Record<string, any>) => {
  return fields.reduce<Record<string, any>>((acc, field) => {
    const overrideValue = overrides ? overrides[field.name] : undefined

    if (overrideValue !== undefined) {
      acc[field.name] = field.type === 'checkbox' ? Boolean(overrideValue) : overrideValue
      return acc
    }

    acc[field.name] = field.type === 'checkbox' ? false : ''
    return acc
  }, {})
}

const ensureOptionPresence = (options: Option[] | undefined, value: any, label?: string): Option[] => {
  if (value === undefined || value === null || value === '' || !label) {
    return options ?? []
  }

  const baseOptions = options ?? []
  if (baseOptions.some((option) => option.value === value)) {
    return baseOptions
  }

  return [...baseOptions, { value, label }]
}

const CreateEntityModal = ({
  config,
  onClose,
  onSubmit,
  mode = 'create',
  initialValues,
  initialOptionLabels,
  initialRecord,
  contextId,
}: CreateEntityModalProps) => {
  const normalizedInitialOptionLabels = useMemo(() => initialOptionLabels ?? {}, [initialOptionLabels])

  const computeInitialOptions = () => {
    const base: Record<string, Option[]> = {}
    config.fields.forEach((field) => {
      const mergedOptions = ensureOptionPresence(
        field.options,
        initialValues?.[field.name],
        normalizedInitialOptionLabels[field.name],
      )

      if (mergedOptions.length > 0) {
        base[field.name] = mergedOptions
      }
    })
    return base
  }

  const [formValues, setFormValues] = useState<Record<string, any>>(() => buildInitialValues(config.fields, initialValues))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [optionErrors, setOptionErrors] = useState<Record<string, string>>({})
  const [optionsMap, setOptionsMap] = useState<Record<string, Option[]>>(computeInitialOptions)

  useEffect(() => {
    setFormValues(buildInitialValues(config.fields, initialValues))
    setFieldErrors({})
    setSubmitError(null)
    setOptionErrors({})
    setOptionsMap(computeInitialOptions())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, initialValues, normalizedInitialOptionLabels])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (!supabaseClient) {
        return
      }

      const fieldsWithFetch = config.fields.filter((field) => field.fetchOptions)
      if (fieldsWithFetch.length === 0) {
        return
      }

      await Promise.all(
        fieldsWithFetch.map(async (field) => {
          try {
            const fetchedOptions = await field.fetchOptions!(supabaseClient)
            if (!isMounted) return

            const merged = ensureOptionPresence(
              fetchedOptions,
              initialValues?.[field.name],
              normalizedInitialOptionLabels[field.name],
            )

            setOptionsMap((prev) => ({ ...prev, [field.name]: merged }))
          } catch (error) {
            if (!isMounted) return
            setOptionErrors((prev) => ({
              ...prev,
              [field.name]:
                error instanceof Error
                  ? error.message
                  : 'Não foi possível carregar as opções deste campo.',
            }))
          }
        }),
      )
    }

    load()

    return () => {
      isMounted = false
    }
  }, [config, initialValues, normalizedInitialOptionLabels])

  useEffect(() => {
    config.fields.forEach((field) => {
      if (field.type !== 'select') return
      const options = optionsMap[field.name]
      if (!options || options.length === 0) return

      setFormValues((prev) => {
        if (prev[field.name] !== undefined && prev[field.name] !== '') {
          return prev
        }
        return { ...prev, [field.name]: options[0].value }
      })
    })
  }, [config.fields, optionsMap])

  const canPersist = Boolean(config.supabaseTable && supabaseClient)

  const optionLabels = useMemo(() => {
    const base = { ...normalizedInitialOptionLabels }
    return Object.keys(formValues).reduce<Record<string, string>>((acc, fieldName) => {
      const options = optionsMap[fieldName]
      if (!options) return acc
      const selected = options.find((option) => option.value === formValues[fieldName])
      if (selected) {
        acc[fieldName] = selected.label
      }
      return acc
    }, base)
  }, [formValues, optionsMap, normalizedInitialOptionLabels])

  const handleChange = (field: FieldConfig, value: any) => {
    setFormValues((prev) => ({ ...prev, [field.name]: value }))
    setFieldErrors((prev) => ({ ...prev, [field.name]: '' }))
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}
    config.fields.forEach((field) => {
      if (!field.required) return
      const value = formValues[field.name]
      if (field.type === 'checkbox') {
        return
      }
      if (value === undefined || value === null || value === '') {
        errors[field.name] = 'Campo obrigatório'
      }
    })
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const payload = config.transform(formValues)
      let record: Record<string, any> | undefined = initialRecord

      if (canPersist) {
        if (mode === 'edit' && (initialRecord?.id || contextId)) {
          const identifier = initialRecord?.id ?? contextId!
          const { data, error } = await supabaseClient!
            .from(config.supabaseTable!)
            .update(payload)
            .eq('id', identifier)
            .select()
            .maybeSingle()

          if (error) {
            throw error
          }

          record = data ?? initialRecord ?? { id: identifier }
        } else {
          const { data, error } = await supabaseClient!
            .from(config.supabaseTable!)
            .insert(payload)
            .select()
            .maybeSingle()

          if (error) {
            throw error
          }

          record = data ?? undefined
        }
      } else if (mode === 'edit' && (initialRecord?.id || contextId)) {
        const identifier = initialRecord?.id ?? contextId
        record = initialRecord ?? (identifier ? { id: identifier } : undefined)
      }

      onSubmit({
        entity: config.entity,
        values: formValues,
        record,
        optionLabels,
        mode,
        contextId,
      })
      onClose()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o cadastro. Tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderInput = (field: FieldConfig) => {
    const value = formValues[field.name]
    const commonProps = {
      id: field.name,
      name: field.name,
      className:
        'mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100',
      disabled: isSubmitting,
    }

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
            placeholder={field.placeholder}
          />
        )
      case 'select':
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
          >
            {(optionsMap[field.name] ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'time':
      case 'date':
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
          />
        )
      case 'datetime':
        return (
          <input
            {...commonProps}
            type="datetime-local"
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
          />
        )
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
            placeholder={field.placeholder}
          />
        )
      case 'checkbox':
        return (
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={Boolean(value)}
              onChange={(event) => handleChange(field, event.target.checked)}
              disabled={isSubmitting}
            />
            {field.placeholder ?? 'Ativo'}
          </label>
        )
      default:
        return (
          <input
            {...commonProps}
            type="text"
            value={value}
            onChange={(event) => handleChange(field, event.target.value)}
            placeholder={field.placeholder}
          />
        )
    }
  }

  const title = mode === 'edit' ? `Editar ${config.createLabel.toLowerCase()}` : config.title
  const submitLabel = mode === 'edit' ? 'Salvar alterações' : 'Salvar'

  return (
    <AnimatePresence>
      <motion.div
        key={`${config.entity}-${mode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 px-4 py-10 backdrop-blur sm:items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/90 max-h-[calc(100vh-5rem)] sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">{config.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-end rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-medium text-slate-600 dark:text-slate-200">
                  {field.label}
                </label>
                {renderInput(field)}
                {field.helperText && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{field.helperText}</p>
                )}
                {optionErrors[field.name] && (
                  <p className="text-xs text-amber-500">{optionErrors[field.name]}</p>
                )}
                {fieldErrors[field.name] && (
                  <p className="text-xs text-rose-500">{fieldErrors[field.name]}</p>
                )}
              </div>
            ))}

            {submitError && <p className="text-sm text-rose-500">{submitError}</p>}

            {!canPersist && (
              <p className="text-xs text-amber-500">
                Supabase não configurado neste ambiente — os dados serão mantidos apenas na visualização atual.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLabel}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateEntityModal
