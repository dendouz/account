"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { KnowledgeArticle } from "@studeo/shared";

const CATEGORY_LABELS: Record<string, string> = {
  statut: "Statuts étudiants",
  fiscal: "Fiscalité",
  social: "Social & allocations",
  admin: "Administratif",
};

export default function KnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ data: KnowledgeArticle[] }>("/knowledge")
      .then((r) => setArticles(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(articles.map((a) => a.category))];

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Guide pratique</h1>
      <p className="text-gray-500 mb-6">Tout ce que tu dois savoir sur l&apos;admin étudiante en Belgique, expliqué simplement.</p>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Aucun article disponible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{CATEGORY_LABELS[cat] || cat}</h2>
              <div className="space-y-3">
                {articles.filter((a) => a.category === cat).map((article) => (
                  <div key={article.id} className="card">
                    <button
                      className="w-full flex items-center justify-between text-left"
                      onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                    >
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      {expanded === article.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expanded === article.id && (
                      <div className="mt-4 pt-4 border-t prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{
                        __html: article.content
                          .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h2>')
                          .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-gray-800 mt-3 mb-1">$1</h3>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
                          .replace(/\| *(.+?) *\| *(.+?) *\| *(.+?) *\|/g, '<div class="flex gap-4 text-xs py-1"><span class="flex-1">$1</span><span class="flex-1">$2</span><span class="flex-1">$3</span></div>')
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
