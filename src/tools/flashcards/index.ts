import { FLASHCARD_DECKS } from './flashcardsData';
import type { CategoryId, FlashcardDeck, FlashcardItem, FlashcardProgressState } from './types';
import { renderVisual } from './visuals';
import template from './flashcardsView.html?raw';

const STORAGE_KEY = 'everything_flashcards_v1';

const CATEGORY_ORDER: Array<{ id: CategoryId; label: string }> = [
    { id: 'hotkeys', label: 'Hotkeys & Keybinds' },
    { id: 'languages', label: 'Languages & Web' },
    { id: 'cs', label: 'CS Fundamentals' },
    { id: 'security', label: 'Security & Networking' },
    { id: 'devops', label: 'DevOps & Git' }
];

function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let isInitialized = false;

export function initFlashcards(): void {
    const stage = document.getElementById('view-tool-flashcards');
    if (!stage) return;

    if (isInitialized) return;
    isInitialized = true;

    if (!stage.hasChildNodes()) {
        stage.innerHTML = template;
    }

    let state: FlashcardProgressState = {
        activeDeckId: FLASHCARD_DECKS[0].id,
        layoutMode: 'drill',
        doneIds: []
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved) as Partial<FlashcardProgressState & { masteredIds?: string[] }>;
            const rawIds = Array.isArray(parsed.doneIds)
                ? parsed.doneIds
                : Array.isArray(parsed.masteredIds)
                  ? parsed.masteredIds
                  : [];
            state = {
                activeDeckId:
                    typeof parsed.activeDeckId === 'string' && FLASHCARD_DECKS.some(d => d.id === parsed.activeDeckId)
                        ? parsed.activeDeckId
                        : FLASHCARD_DECKS[0].id,
                layoutMode: parsed.layoutMode === 'grid' ? 'grid' : 'drill',
                doneIds: rawIds
            };
        } catch {
            // Keep default
        }
    }

    const persist = (): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage safe
        }
    };

    // DOM refs
    const globalStatsEl = document.getElementById('fc-global-stats');
    const drillModeBtn = document.getElementById('fc-mode-drill-btn');
    const gridModeBtn = document.getElementById('fc-mode-grid-btn');
    const deckTreeEl = document.getElementById('fc-deck-tree');
    const searchInput = document.getElementById('fc-search-input') as HTMLInputElement | null;

    const activeTitleEl = document.getElementById('fc-active-title');
    const activeSubEl = document.getElementById('fc-active-subtitle');
    const deckProgressBadge = document.getElementById('fc-deck-progress-badge');
    const deckProgressBar = document.getElementById('fc-deck-progress-bar');
    const topicStripEl = document.getElementById('fc-topic-strip');

    const shuffleBtn = document.getElementById('fc-shuffle-btn');
    const resetDeckBtn = document.getElementById('fc-reset-deck-btn');

    const drillStageEl = document.getElementById('fc-drill-stage');
    const gridStageEl = document.getElementById('fc-grid-stage');

    const cardSurface = document.getElementById('fc-card-surface');
    const cardTopicEl = document.getElementById('fc-card-topic');
    const cardCounterEl = document.getElementById('fc-card-counter');
    const cardQuestionEl = document.getElementById('fc-card-question');
    const cardVisualEl = document.getElementById('fc-card-visual');
    const cardHintEl = document.getElementById('fc-card-hint');
    const cardAnswerBox = document.getElementById('fc-card-answer-box');
    const cardAnswerEl = document.getElementById('fc-card-answer');
    const flipPromptEl = document.getElementById('fc-flip-prompt');
    const deckDoneBanner = document.getElementById('fc-deck-done-banner');

    const prevBtn = document.getElementById('fc-prev-btn');
    const nextBtn = document.getElementById('fc-next-btn');

    const gridCardsEl = document.getElementById('fc-grid-cards');
    const gridRevealAllBtn = document.getElementById('fc-grid-reveal-all');
    const gridBlurAllBtn = document.getElementById('fc-grid-blur-all');

    let selectedTopic = 'all';
    let searchQuery = '';
    let currentCardIdx = 0;
    let isFlipped = false;
    let shuffledOrder: string[] | null = null;

    function getActiveDeck(): FlashcardDeck {
        return FLASHCARD_DECKS.find(d => d.id === state.activeDeckId) ?? FLASHCARD_DECKS[0];
    }

    function getFilteredCards(): FlashcardItem[] {
        const deck = getActiveDeck();
        let cards = deck.cards.filter(card => {
            if (selectedTopic !== 'all' && card.topic !== selectedTopic) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    card.prompt.toLowerCase().includes(q) ||
                    card.answer.toLowerCase().includes(q) ||
                    card.topic.toLowerCase().includes(q)
                );
            }
            return true;
        });

        if (shuffledOrder) {
            const orderMap = new Map<string, number>();
            shuffledOrder.forEach((id, i) => orderMap.set(id, i));
            cards = [...cards].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
        }

        return cards;
    }

    function markCardDone(cardId: string): void {
        if (!state.doneIds.includes(cardId)) {
            state.doneIds.push(cardId);
            persist();
        }
    }

    function renderSidebar(): void {
        const doneSet = new Set(state.doneIds);
        const totalCards = FLASHCARD_DECKS.reduce((sum, d) => sum + d.cards.length, 0);
        const totalDone = FLASHCARD_DECKS.reduce((sum, d) => sum + d.cards.filter(c => doneSet.has(c.id)).length, 0);

        if (globalStatsEl) {
            globalStatsEl.textContent = `${totalDone} / ${totalCards} Done`;
            globalStatsEl.classList.toggle('is-complete', totalDone === totalCards && totalCards > 0);
        }

        if (!deckTreeEl) return;
        deckTreeEl.innerHTML = '';

        CATEGORY_ORDER.forEach(cat => {
            const decks = FLASHCARD_DECKS.filter(d => d.category === cat.id);
            if (decks.length === 0) return;

            const group = document.createElement('div');
            group.className = 'fc-cat-group';

            const heading = document.createElement('div');
            heading.className = 'fc-cat-heading';
            heading.textContent = cat.label;
            group.appendChild(heading);

            decks.forEach(deck => {
                const doneCount = deck.cards.filter(c => doneSet.has(c.id)).length;
                const isDone = doneCount === deck.cards.length && deck.cards.length > 0;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `fc-deck-btn ${deck.id === state.activeDeckId ? 'active' : ''}`;
                btn.innerHTML = `
                    <span>${escapeHtml(deck.title)}</span>
                    <span class="fc-deck-count ${isDone ? 'is-complete' : ''}">${isDone ? '✓ ' : ''}${doneCount}/${deck.cards.length}</span>
                `;
                btn.addEventListener('click', () => {
                    state.activeDeckId = deck.id;
                    selectedTopic = 'all';
                    currentCardIdx = 0;
                    isFlipped = false;
                    shuffledOrder = null;
                    persist();
                    renderAll();
                });
                group.appendChild(btn);
            });

            deckTreeEl.appendChild(group);
        });
    }

    function renderTopics(): void {
        if (!topicStripEl) return;
        const deck = getActiveDeck();
        const topics = Array.from(new Set(deck.cards.map(c => c.topic)));

        topicStripEl.innerHTML = '';
        ['all', ...topics].forEach(topic => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `hotkey-cat-btn ${selectedTopic === topic ? 'active' : ''}`;
            btn.textContent = topic === 'all' ? `All (${deck.cards.length})` : topic;
            btn.addEventListener('click', () => {
                selectedTopic = topic;
                currentCardIdx = 0;
                isFlipped = false;
                renderStage();
            });
            topicStripEl.appendChild(btn);
        });
    }

    function renderStage(): void {
        const deck = getActiveDeck();
        const doneSet = new Set(state.doneIds);
        const deckDone = deck.cards.filter(c => doneSet.has(c.id)).length;
        const isDeckComplete = deckDone === deck.cards.length && deck.cards.length > 0;
        const pct = deck.cards.length > 0 ? Math.round((deckDone / deck.cards.length) * 100) : 0;

        if (activeTitleEl) activeTitleEl.textContent = deck.title;
        if (activeSubEl) activeSubEl.textContent = deck.subtitle;
        if (deckProgressBadge) {
            deckProgressBadge.textContent = isDeckComplete
                ? `✓ ${deckDone} / ${deck.cards.length} Done`
                : `${deckDone} / ${deck.cards.length}`;
            deckProgressBadge.classList.toggle('is-complete', isDeckComplete);
        }
        if (deckProgressBar) {
            deckProgressBar.style.width = `${pct}%`;
            deckProgressBar.classList.toggle('is-complete', isDeckComplete);
        }
        if (deckDoneBanner) {
            deckDoneBanner.style.display = isDeckComplete ? 'inline-flex' : 'none';
        }
        if (shuffleBtn) {
            shuffleBtn.textContent = shuffledOrder ? 'Unshuffle' : 'Shuffle';
            shuffleBtn.classList.toggle('highlight', shuffledOrder !== null);
        }

        renderTopics();

        const isDrill = state.layoutMode === 'drill';
        drillModeBtn?.classList.toggle('active', isDrill);
        gridModeBtn?.classList.toggle('active', !isDrill);
        if (drillStageEl) drillStageEl.style.display = isDrill ? 'flex' : 'none';
        if (gridStageEl) gridStageEl.style.display = isDrill ? 'none' : 'flex';

        const cards = getFilteredCards();

        if (isDrill) {
            if (cards.length === 0) {
                cardSurface?.classList.remove('flipped', 'hide-visual-unflipped');
                if (cardTopicEl) cardTopicEl.textContent = 'Empty';
                if (cardCounterEl) cardCounterEl.textContent = '0 / 0';
                if (cardQuestionEl) cardQuestionEl.textContent = 'No flashcards match your search.';
                if (cardVisualEl) cardVisualEl.innerHTML = '';
                if (cardHintEl) cardHintEl.style.display = 'none';
                if (cardAnswerBox) cardAnswerBox.style.display = 'none';
                if (flipPromptEl) flipPromptEl.textContent = '';
                return;
            }

            if (currentCardIdx >= cards.length) currentCardIdx = 0;
            if (currentCardIdx < 0) currentCardIdx = cards.length - 1;

            const card = cards[currentCardIdx];
            const isCardDone = doneSet.has(card.id);

            cardSurface?.classList.toggle('flipped', isFlipped);
            // Hotkeys show visual cue on front; concept diagrams reveal on flip so they don't spoil the answer
            cardSurface?.classList.toggle('hide-visual-unflipped', !card.isHotkey);

            if (cardTopicEl) {
                cardTopicEl.textContent = isCardDone ? `${card.topic} · ✓` : card.topic;
                cardTopicEl.classList.toggle('is-complete', isCardDone);
            }
            if (cardCounterEl) cardCounterEl.textContent = `${currentCardIdx + 1} / ${cards.length}`;
            if (cardQuestionEl) cardQuestionEl.textContent = card.prompt;
            if (cardVisualEl) cardVisualEl.innerHTML = renderVisual(card.visual);

            if (cardHintEl) {
                if (card.hint) {
                    cardHintEl.textContent = `Hint: ${card.hint}`;
                    cardHintEl.style.display = 'block';
                } else {
                    cardHintEl.style.display = 'none';
                }
            }

            if (cardAnswerBox) cardAnswerBox.style.display = 'flex';
            if (cardAnswerEl) {
                cardAnswerEl.textContent = card.answer;
                cardAnswerEl.classList.toggle('is-hotkey', Boolean(card.isHotkey));
            }
            if (flipPromptEl) {
                flipPromptEl.textContent = isFlipped
                    ? 'Press Next → (or → arrow) for next card'
                    : 'Click card or press Space to reveal · ← / → to navigate';
            }
        } else if (gridCardsEl) {
            gridCardsEl.innerHTML = '';
            if (cards.length === 0) {
                gridCardsEl.innerHTML = '<div class="empty-state-notice">No flashcards match your filter.</div>';
                return;
            }

            cards.forEach(card => {
                const isCardDone = doneSet.has(card.id);
                const item = document.createElement('button');
                item.type = 'button';
                item.className = `fc-grid-item ${!card.isHotkey ? 'hide-visual-unflipped' : ''} ${isCardDone ? 'revealed' : ''}`;
                item.innerHTML = `
                    <div class="fc-grid-item-top">
                        <span class="pill-badge ${isCardDone ? 'is-complete' : ''}" style="font-size:0.62rem;">
                            ${isCardDone ? '✓ ' : ''}${escapeHtml(card.topic)}
                        </span>
                    </div>
                    <div class="hotkey-action-text">${escapeHtml(card.prompt)}</div>
                    <div class="fc-grid-visual">${renderVisual(card.visual)}</div>
                    ${card.hint ? `<div class="hotkey-note-text">${escapeHtml(card.hint)}</div>` : ''}
                    <div class="fc-grid-answer ${card.isHotkey ? 'is-hotkey' : ''}">${escapeHtml(card.answer)}</div>
                `;

                item.addEventListener('click', () => {
                    const willReveal = !item.classList.contains('revealed');
                    item.classList.toggle('revealed', willReveal);
                    if (willReveal) {
                        markCardDone(card.id);
                        renderSidebar();
                        // Update header badge/bar without wiping grid revealed states
                        const currentDeck = getActiveDeck();
                        const newDoneSet = new Set(state.doneIds);
                        const doneCount = currentDeck.cards.filter(c => newDoneSet.has(c.id)).length;
                        const complete = doneCount === currentDeck.cards.length;
                        if (deckProgressBadge) {
                            deckProgressBadge.textContent = complete
                                ? `✓ ${doneCount} / ${currentDeck.cards.length} Done`
                                : `${doneCount} / ${currentDeck.cards.length}`;
                            deckProgressBadge.classList.toggle('is-complete', complete);
                        }
                        const pill = item.querySelector('.pill-badge');
                        if (pill) {
                            pill.textContent = `✓ ${card.topic}`;
                            pill.classList.add('is-complete');
                        }
                    }
                });

                gridCardsEl.appendChild(item);
            });
        }
    }

    function flipCurrentCard(): void {
        const cards = getFilteredCards();
        if (cards.length === 0) return;
        isFlipped = !isFlipped;
        if (isFlipped) {
            markCardDone(cards[currentCardIdx].id);
            renderSidebar();
        }
        renderStage();
    }

    function advanceCard(delta: number): void {
        const cards = getFilteredCards();
        if (cards.length === 0) return;
        currentCardIdx = (currentCardIdx + delta + cards.length) % cards.length;
        isFlipped = false;
        renderStage();
    }

    function renderAll(): void {
        renderSidebar();
        renderStage();
    }

    drillModeBtn?.addEventListener('click', () => {
        state.layoutMode = 'drill';
        persist();
        renderStage();
    });

    gridModeBtn?.addEventListener('click', () => {
        state.layoutMode = 'grid';
        persist();
        renderStage();
    });

    searchInput?.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        currentCardIdx = 0;
        isFlipped = false;
        renderStage();
    });

    cardSurface?.addEventListener('click', flipCurrentCard);

    prevBtn?.addEventListener('click', () => {
        advanceCard(-1);
    });

    nextBtn?.addEventListener('click', () => {
        advanceCard(1);
    });

    // Toggle Shuffle / Unshuffle
    shuffleBtn?.addEventListener('click', () => {
        if (shuffledOrder) {
            shuffledOrder = null;
        } else {
            const deck = getActiveDeck();
            const ids = deck.cards.map(c => c.id);
            for (let i = ids.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const tmp = ids[i];
                ids[i] = ids[j];
                ids[j] = tmp;
            }
            shuffledOrder = ids;
        }
        currentCardIdx = 0;
        isFlipped = false;
        renderStage();
    });

    resetDeckBtn?.addEventListener('click', () => {
        const deck = getActiveDeck();
        const deckIds = new Set(deck.cards.map(c => c.id));
        state.doneIds = state.doneIds.filter(id => !deckIds.has(id));
        currentCardIdx = 0;
        isFlipped = false;
        persist();
        renderAll();
    });

    gridRevealAllBtn?.addEventListener('click', () => {
        gridCardsEl?.classList.remove('study-mode');
    });

    gridBlurAllBtn?.addEventListener('click', () => {
        gridCardsEl?.classList.add('study-mode');
        gridCardsEl?.querySelectorAll('.fc-grid-item').forEach(el => {
            el.classList.remove('revealed');
        });
    });

    // Keyboard shortcuts when Flashcards view is active
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (stage.style.display === 'none') return;
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (state.layoutMode !== 'drill') return;

        if (e.code === 'Space') {
            e.preventDefault();
            flipCurrentCard();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            advanceCard(1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            advanceCard(-1);
        }
    });

    renderAll();
}
