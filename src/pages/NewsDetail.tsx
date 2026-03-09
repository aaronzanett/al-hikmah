import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { allNewsItems } from "./News";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const article = allNewsItems.find(n => n.id === id);
  const currentIndex = allNewsItems.findIndex(n => n.id === id);

  if (!article) return <Navigate to="/news" replace />;

  const relatedArticles = allNewsItems.filter(n => n.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/news" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Semua Berita
          </Link>
          <h1 className="text-base font-bold text-foreground hidden sm:block">Berita Pesantren</h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-4 lg:px-8 py-10 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{article.category}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight font-display">
            {article.title}
          </h1>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden mb-8 border shadow-card">
            <img src={article.image} alt={article.title} className="w-full aspect-[16/9] object-cover" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                {paragraph.startsWith("**") ? (
                  <strong className="text-foreground">{paragraph.replace(/\*\*/g, "")}</strong>
                ) : paragraph.startsWith("- ") ? (
                  <span className="block pl-4 border-l-2 border-primary/30 ml-2">{paragraph}</span>
                ) : paragraph.match(/^\d\./) ? (
                  <span className="block pl-4 border-l-2 border-accent/30 ml-2">{paragraph}</span>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          {currentIndex > 0 ? (
            <Link to={`/news/${allNewsItems[currentIndex - 1].id}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Sebelumnya
            </Link>
          ) : <div />}
          {currentIndex < allNewsItems.length - 1 ? (
            <Link to={`/news/${allNewsItems[currentIndex + 1].id}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Selanjutnya <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      </article>

      {/* Related */}
      <section className="bg-muted/30 py-16 islamic-pattern-arabesque">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-8">Berita Lainnya</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map(news => (
              <Link key={news.id} to={`/news/${news.id}`}>
                <article className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{news.category}</span>
                    <h3 className="font-semibold text-sm text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
