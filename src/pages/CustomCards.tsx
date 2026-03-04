import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Pencil, Trash2, Copy, Check, Volume2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomCards, CustomCard, CustomExample } from '@/hooks/useCustomCards';
import { cn } from '@/lib/utils';

// Anki export for custom cards
const generateCustomAnkiHTML = (card: CustomCard) => {
  const front = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;background-color:#0f172a;margin:0;padding:0;"><span style="font-size:160px;font-family:'Noto Sans JP',sans-serif;color:#f1f5f9;">${card.kanji}</span></div>`;

  const exampleRows = card.examples.map((ex) =>
    `<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(30,41,59,0.4);"><div style="font-size:18px;color:#f1f5f9;font-family:'Noto Sans JP',sans-serif;">${ex.j}</div><div style="font-size:14px;color:#cbd5e1;margin-top:4px;">${ex.e}</div><div style="font-size:12px;color:#64748b;margin-top:2px;">${ex.m}</div></div>`
  ).join('');

  const vocabSection = card.examples.length > 0
    ? `<div style="border-top:1px solid #1e293b;padding-top:20px;width:100%;margin-top:8px;"><div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;">Vocabulary</div>${exampleRows}</div>`
    : '';

  const meaningSection = card.meaning
    ? `<div style="font-size:14px;color:#94a3b8;margin-bottom:20px;">${card.meaning}</div>`
    : '';

  const back = `<div style="min-height:100vh;background-color:#0f172a;color:#e2e8f0;font-family:'Noto Sans JP','Inter',sans-serif;padding:32px;display:flex;flex-direction:column;justify-content:center;align-items:center;"><div style="max-width:480px;width:100%;text-align:center;"><div style="font-size:72px;margin-bottom:16px;color:#f1f5f9;">${card.kanji}</div>${meaningSection}<div style="display:flex;justify-content:center;gap:40px;margin-bottom:24px;"><div><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">訓読み Kun</span><span style="font-size:24px;color:#f1f5f9;">${card.kunyomi || '—'}</span></div><div><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">音読み On</span><span style="font-size:24px;color:#f1f5f9;">${card.onyomi || '—'}</span></div></div>${vocabSection}</div></div>`;

  return { front, back };
};

const emptyForm = () => ({
  kanji: '',
  kunyomi: '',
  onyomi: '',
  meaning: '',
  examples: [{ j: '', e: '', m: '' }],
});

const CardForm = ({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: ReturnType<typeof emptyForm>;
  onSave: (data: ReturnType<typeof emptyForm>) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [form, setForm] = useState(initial);

  const setField = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const setExample = (idx: number, field: keyof CustomExample, value: string) =>
    setForm(f => {
      const examples = [...f.examples];
      examples[idx] = { ...examples[idx], [field]: value };
      return { ...f, examples };
    });

  const addExample = () =>
    setForm(f => ({ ...f, examples: [...f.examples, { j: '', e: '', m: '' }] }));

  const removeExample = (idx: number) =>
    setForm(f => ({ ...f, examples: f.examples.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Kanji *</Label>
          <Input value={form.kanji} onChange={e => setField('kanji', e.target.value)} placeholder="字" />
        </div>
        <div className="space-y-1.5">
          <Label>Meaning</Label>
          <Input value={form.meaning} onChange={e => setField('meaning', e.target.value)} placeholder="English meaning" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Kunyomi (訓読み)</Label>
          <Input value={form.kunyomi} onChange={e => setField('kunyomi', e.target.value)} placeholder="くん" className="font-japanese" />
        </div>
        <div className="space-y-1.5">
          <Label>Onyomi (音読み)</Label>
          <Input value={form.onyomi} onChange={e => setField('onyomi', e.target.value)} placeholder="オン" className="font-japanese" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Vocabulary Examples</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addExample} className="gap-1 h-7 text-xs">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        {form.examples.map((ex, idx) => (
          <div key={idx} className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Example {idx + 1}</span>
              {form.examples.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeExample(idx)} className="h-6 w-6 p-0">
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
            <Input value={ex.j} onChange={e => setExample(idx, 'j', e.target.value)} placeholder="日本語" className="font-japanese text-sm" />
            <Input value={ex.e} onChange={e => setExample(idx, 'e', e.target.value)} placeholder="English translation" className="text-sm" />
            <Input value={ex.m} onChange={e => setExample(idx, 'm', e.target.value)} placeholder="Meaning / notes" className="text-sm" />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={!form.kanji.trim() || saving} className="flex-1">
          {saving ? 'Saving…' : 'Save Card'}
        </Button>
      </div>
    </div>
  );
};

// Flashcard view for a custom card
const CustomFlashCard = ({ card, onEdit, onDelete }: { card: CustomCard; onEdit: () => void; onDelete: () => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState<'front' | 'back' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const ankiHTML = generateCustomAnkiHTML(card);

  const copy = async (text: string, side: 'front' | 'back') => {
    await navigator.clipboard.writeText(text);
    setCopied(side);
    setTimeout(() => setCopied(null), 2000);
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    speechSynthesis.speak(u);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Flip card */}
      <div className="perspective-1000 cursor-pointer mb-6" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={cn("relative w-full aspect-[4/3] preserve-3d transition-transform duration-500", isFlipped && "rotate-y-180")}>
          {/* Front */}
          <div className={cn("absolute inset-0 backface-hidden bg-card rounded-2xl flex flex-col items-center justify-center shadow-xl border border-border/50")}>
            <span className="text-8xl md:text-9xl font-japanese text-foreground">{card.kanji}</span>
            {card.meaning && <p className="text-sm text-muted-foreground mt-4">{card.meaning}</p>}
            {/* Edit / Delete buttons */}
            <div className="absolute top-4 right-4 flex gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={e => { e.stopPropagation(); onEdit(); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Back */}
          <div className={cn("absolute inset-0 backface-hidden rotate-y-180 bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border/50 flex flex-col justify-center")}>
            <div className="space-y-4">
              {card.kunyomi && (
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm w-12">Kun:</span>
                  <span className="text-2xl md:text-3xl font-japanese text-foreground">{card.kunyomi}</span>
                </div>
              )}
              {card.onyomi && (
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm w-12">On:</span>
                  <span className="text-2xl md:text-3xl font-japanese text-foreground">{card.onyomi}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm mb-8">Tap the card to flip</p>

      {/* Actions row */}
      <div className="flex justify-center mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Copy for Anki
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Anki Card HTML — {card.kanji}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(['front', 'back'] as const).map(side => (
                <div key={side}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground capitalize">{side}</span>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-7" onClick={() => copy(ankiHTML[side], side)}>
                      {copied === side ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === side ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono text-foreground">
                    {ankiHTML[side]}
                  </pre>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vocabulary */}
      {card.examples.filter(e => e.j).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Vocabulary</h3>
          <div className="space-y-4">
            {card.examples.filter(e => e.j).map((example, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 py-3 border-b border-border/30 last:border-0">
                <div className="space-y-1 flex-1">
                  <p className="text-lg font-japanese text-foreground">{example.j}</p>
                  {example.e && <p className="text-sm text-foreground">{example.e}</p>}
                  {example.m && <p className="text-xs text-muted-foreground">{example.m}</p>}
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => speak(example.j.split(' ')[0])}>
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{card.kanji}"?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={() => { setConfirmDelete(false); onDelete(); }} className="flex-1">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CustomCards = () => {
  const navigate = useNavigate();
  const { cards, loading, createCard, updateCard, deleteCard } = useCustomCards();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedId) || cards[0] || null;

  const handleSave = async (form: ReturnType<typeof emptyForm>) => {
    setSaving(true);
    const payload = {
      kanji: form.kanji.trim(),
      kunyomi: form.kunyomi.trim(),
      onyomi: form.onyomi.trim(),
      meaning: form.meaning.trim(),
      examples: form.examples.filter(e => e.j.trim()),
    };
    if (editingCard) {
      await updateCard(editingCard.id, payload);
    } else {
      const { error } = await createCard(payload);
      if (!error) setSelectedId(null); // will auto-select first
    }
    setSaving(false);
    setShowForm(false);
    setEditingCard(null);
  };

  const handleEdit = (card: CustomCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCard(id);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1 -ml-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <h1 className="text-lg font-semibold text-foreground">My Cards</h1>
            </div>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => { setEditingCard(null); setShowForm(true); }}
            >
              <Plus className="w-4 h-4" /> New Card
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-4 sm:py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading…</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No custom cards yet</h2>
            <p className="text-muted-foreground text-sm mb-6">Create your own kanji cards to study and export to Anki.</p>
            <Button onClick={() => setShowForm(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Create First Card
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar list */}
            <aside className="lg:w-64 shrink-0">
              <div className="space-y-2">
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedId(card.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
                      (selectedCard?.id === card.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted border border-border/50"
                    )}
                  >
                    <span className="text-2xl font-japanese">{card.kanji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{card.meaning || card.kunyomi || card.onyomi || '—'}</p>
                      {card.kunyomi && (
                        <p className={cn("text-xs truncate font-japanese", selectedCard?.id === card.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {card.kunyomi}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main flashcard view */}
            <main className="flex-1 min-w-0">
              {selectedCard && (
                <CustomFlashCard
                  key={selectedCard.id}
                  card={selectedCard}
                  onEdit={() => handleEdit(selectedCard)}
                  onDelete={() => handleDelete(selectedCard.id)}
                />
              )}
            </main>
          </div>
        )}
      </div>

      {/* Add / Edit form dialog */}
      <Dialog open={showForm} onOpenChange={v => { if (!v) { setShowForm(false); setEditingCard(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? `Edit — ${editingCard.kanji}` : 'New Custom Card'}</DialogTitle>
          </DialogHeader>
          <CardForm
            key={editingCard?.id ?? 'new'}
            initial={editingCard
              ? { kanji: editingCard.kanji, kunyomi: editingCard.kunyomi, onyomi: editingCard.onyomi, meaning: editingCard.meaning, examples: editingCard.examples.length ? editingCard.examples : [{ j: '', e: '', m: '' }] }
              : emptyForm()
            }
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingCard(null); }}
            saving={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomCards;
