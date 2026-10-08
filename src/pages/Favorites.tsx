import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, BookOpen, Heart } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { RecipeCard } from '@/components/RecipeCard'
import { ArticleRow } from '@/components/ArticleRow'
import { Card, EmptyState, Segmented } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { useApp } from '@/contexts/AppContext'
import { getRecipe, type Recipe } from '@/data/recipes'
import { getArticle, type Article } from '@/data/articles'

export default function Favorites() {
  const { favorites } = useApp()
  const [tab, setTab] = useState<'recipe' | 'article'>('recipe')

  const recipes = favorites
    .filter((f) => f.kind === 'recipe')
    .map((f) => getRecipe(f.slug))
    .filter(Boolean) as Recipe[]
  const articles = favorites
    .filter((f) => f.kind === 'article')
    .map((f) => getArticle(f.slug))
    .filter(Boolean) as Article[]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Meus favoritos" subtitle="Tudo o que você salvou, em um só lugar." />
      <Segmented
        label="Tipo de favorito"
        value={tab}
        onChange={setTab}
        className="mb-6 sm:max-w-sm"
        options={[
          { value: 'recipe', label: `Receitas (${recipes.length})`, icon: ChefHat },
          { value: 'article', label: `Conteúdos (${articles.length})`, icon: BookOpen },
        ]}
      />

      {tab === 'recipe' ? (
        recipes.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nenhuma receita salva"
            text="Toque no coração de uma receita para encontrá-la aqui depois."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/receitas">Explorar receitas</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        )
      ) : articles.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nenhum conteúdo salvo"
          text="Use o botão “Favoritar” nos conteúdos de Aprenda."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/aprenda">Ver conteúdos</Link>
            </Button>
          }
        />
      ) : (
        <Card className="divide-y divide-line overflow-hidden lg:max-w-2xl">
          {articles.map((a) => (
            <ArticleRow key={a.slug} article={a} showCategory />
          ))}
        </Card>
      )}
    </div>
  )
}
