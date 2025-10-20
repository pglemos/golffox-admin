import { useMemo, useState } from 'react'
import { AlertTriangle, Building2, Search } from 'lucide-react'

import type { Company } from '../../../../src/types/types'
import type { ThemeTokens } from './App'
import { MetricCard } from './components/MetricCard'

export type CompaniesPageProps = {
  companies: Company[]
  glassClass: string
  tokens: Pick<ThemeTokens, 'quickTitle' | 'quickDescription'>
  isLight: boolean
}

const CompaniesPage = ({ companies, glassClass, tokens, isLight }: CompaniesPageProps) => {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | Company['status']>('todos')

  const totalAtivas = useMemo(() => companies.filter((company) => company.status === 'Ativo').length, [companies])
  const totalInativas = useMemo(() => companies.filter((company) => company.status === 'Inativo').length, [companies])
  const totalPassageiros = useMemo(
    () => companies.reduce((acc, company) => acc + (company.contractedPassengers ?? 0), 0),
    [companies]
  )

  const filtroNormalizado = busca.trim().toLowerCase()
  const filteredCompanies = useMemo(() => {
    if (!filtroNormalizado && filtroStatus === 'todos') return companies

    const termoNumerico = filtroNormalizado.replace(/[^0-9]/g, '')

    return companies.filter((company) => {
      const nomeMatch = company.name.toLowerCase().includes(filtroNormalizado)
      const contatoMatch = company.contact.toLowerCase().includes(filtroNormalizado)
      const enderecoMatch = company.address.text.toLowerCase().includes(filtroNormalizado)
      const cnpjNormalizado = company.cnpj.replace(/[^0-9]/g, '')
      const cnpjMatch = termoNumerico.length > 0 && cnpjNormalizado.includes(termoNumerico)

      const matchesSearch = filtroNormalizado.length === 0 ? true : nomeMatch || contatoMatch || enderecoMatch || cnpjMatch
      const matchesStatus = filtroStatus === 'todos' || company.status === filtroStatus

      return matchesSearch && matchesStatus
    })
  }, [companies, filtroNormalizado, filtroStatus])

  const resultadoLegenda = `${filteredCompanies.length} ${
    filteredCompanies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'
  }`

  const inputBase = isLight
    ? 'border-slate-200/70 bg-white/95 text-slate-700 placeholder:text-slate-400 focus:ring-blue-300 focus:border-blue-300'
    : 'border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus:ring-blue-500/40 focus:border-blue-500/40'

  const selectBase = isLight
    ? 'border-slate-200/70 bg-white/95 text-slate-700 focus:ring-blue-300 focus:border-blue-300'
    : 'border-white/10 bg-white/5 text-white focus:ring-blue-500/40 focus:border-blue-500/40'

  const headerClass = isLight ? 'bg-slate-100/70 text-slate-600' : 'bg-white/10 text-slate-200'
  const dividerClass = isLight ? 'divide-y divide-slate-200/60' : 'divide-y divide-white/10'
  const rowHoverClass = isLight ? 'transition-colors hover:bg-slate-100/60' : 'transition-colors hover:bg-white/5'
  const mutedTextClass = isLight ? 'text-slate-500' : 'text-slate-400'
  const contactTextClass = isLight ? 'text-slate-600' : 'text-slate-200'
  const emptyStateText = isLight ? 'text-slate-500' : 'text-slate-400'

  const statusBadgeClasses = (status: Company['status']) => {
    if (status === 'Ativo') {
      return isLight
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
    }
    return isLight
      ? 'bg-slate-200 text-slate-600 border border-slate-300'
      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
  }

  const statusLabel = (status: Company['status']) => (status === 'Ativo' ? 'Ativa' : 'Inativa')
  const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value)

  return (
    <div className="space-y-6 text-left">
      <div className={`rounded-2xl p-6 ${glassClass}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl ${
                isLight ? 'bg-blue-500/10 text-blue-600' : 'bg-blue-500/15 text-blue-300'
              }`}
            >
              <Building2 size={24} />
            </div>
            <div className="space-y-1">
              <h1 className={`text-2xl font-semibold tracking-tight ${tokens.quickTitle}`}>Empresas parceiras</h1>
              <p className={`text-sm leading-relaxed ${tokens.quickDescription}`}>
                Centralize o cadastro das empresas contratantes e acompanhe a saúde de cada contrato em tempo real.
              </p>
            </div>
          </div>
          <div
            className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide ${
              isLight
                ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
            }`}
          >
            Dados sincronizados automaticamente
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Building2}
          title="Empresas ativas"
          value={totalAtivas}
          sub={`de ${companies.length} cadastradas`}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          tone="#22c55e"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Empresas em revisão"
          value={totalInativas}
          sub={totalInativas > 0 ? 'Priorize o contato com estas empresas' : 'Todos os contratos em dia'}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          tone="#f97316"
        />
        <MetricCard
          icon={Building2}
          title="Passageiros contratados"
          value={formatNumber(totalPassageiros)}
          sub="Capacidade prevista nos contratos"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          tone="#38bdf8"
        />
      </div>

      <div className={`rounded-2xl p-4 ${glassClass}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${tokens.quickTitle}`}>Empresas cadastradas</h2>
            <p className={`text-sm ${tokens.quickDescription}`}>Pesquise por nome, CNPJ, contato ou endereço.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome ou CNPJ"
                className={`w-full rounded-xl border px-10 py-2 text-sm outline-none transition ${inputBase}`}
              />
            </div>
            <select
              value={filtroStatus}
              onChange={(event) => setFiltroStatus(event.target.value as typeof filtroStatus)}
              className={`rounded-xl border px-3 py-2 text-sm outline-none transition ${selectBase}`}
            >
              <option value="todos">Todos os status</option>
              <option value="Ativo">Somente ativas</option>
              <option value="Inativo">Somente inativas</option>
            </select>
          </div>
        </div>
        <p className={`mt-3 text-xs ${tokens.quickDescription}`}>{resultadoLegenda}</p>
      </div>

      <div className={`overflow-hidden rounded-2xl ${glassClass}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className={headerClass}>
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Empresa</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">CNPJ</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Passageiros</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Contato</th>
              </tr>
            </thead>
            <tbody className={dividerClass}>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td className={`px-4 py-6 text-center text-sm ${emptyStateText}`} colSpan={5}>
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className={rowHoverClass}>
                    <td className="px-4 py-3 font-semibold tracking-tight">{company.name}</td>
                    <td className={`px-4 py-3 text-sm ${mutedTextClass}`}>{company.cnpj}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatNumber(company.contractedPassengers)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(
                        company.status
                      )}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {statusLabel(company.status)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${contactTextClass}`}>{company.contact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompaniesPage
