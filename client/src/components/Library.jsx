import React from 'react';
import './Library.css';

export const BOOKS = [
  // Structure
  { id: 1,  title: 'Floor Slab Offsetting',       author: 'Aisha Kim',    org: 'Gensler',    steps: 8,  category: 'Structure',        color: 'bk-rose'   },
  { id: 2,  title: 'Stair Run Generator',          author: 'Tunde Okafor', org: 'SOM',        steps: 11, category: 'Structure',        color: 'bk-blue'   },
  { id: 3,  title: 'Beam Depth Sizing',            author: 'Sunmi Park',   org: 'Community',  steps: 5,  category: 'Structure',        color: 'bk-teal'   },
  { id: 4,  title: 'Level Datum Management',       author: 'Aisha Kim',    org: 'Gensler',    steps: 9,  category: 'Structure',        color: 'bk-amber'  },

  // Geometry & Form
  { id: 5,  title: 'Adaptive Facade Panelisation', author: 'Zoe Han',      org: 'BIG',        steps: 15, category: 'Geometry & Form',  color: 'bk-indigo' },
  { id: 6,  title: 'Surface UV Division',          author: 'Marco Ricci',  org: 'Community',  steps: 8,  category: 'Geometry & Form',  color: 'bk-pink'   },
  { id: 7,  title: 'Attractor Point Fields',       author: 'Lena Novak',   org: 'Zaha Hadid', steps: 12, category: 'Geometry & Form',  color: 'bk-cyan'   },
  { id: 8,  title: 'Loft from Curves',             author: 'Priya Chen',   org: 'HOK',        steps: 6,  category: 'Geometry & Form',  color: 'bk-orange' },
  { id: 9,  title: 'Voronoi Ceiling Pattern',      author: 'Lena Novak',   org: 'Community',  steps: 13, category: 'Geometry & Form',  color: 'bk-lime'   },
  { id: 10, title: 'Curve Offset Array',           author: 'Tunde Okafor', org: 'SOM',        steps: 7,  category: 'Geometry & Form',  color: 'bk-purple' },

  // Data & Parameters
  { id: 11, title: 'Room Numbering Automation',    author: 'Marco Ricci',  org: 'Community',  steps: 12, category: 'Data & Parameters', color: 'bk-rose'   },
  { id: 12, title: 'Parameter Batch Rename',       author: 'Sunmi Park',   org: 'Community',  steps: 5,  category: 'Data & Parameters', color: 'bk-teal'   },
  { id: 13, title: 'Schedule to Excel Export',     author: 'Aisha Kim',    org: 'Gensler',    steps: 9,  category: 'Data & Parameters', color: 'bk-blue'   },
  { id: 14, title: 'Element Type Filter',          author: 'Priya Chen',   org: 'HOK',        steps: 6,  category: 'Data & Parameters', color: 'bk-amber'  },
  { id: 15, title: 'Area Calculation & Reporting', author: 'Tunde Okafor', org: 'SOM',        steps: 14, category: 'Data & Parameters', color: 'bk-indigo' },
  { id: 16, title: 'Family Type Swap',             author: 'Zoe Han',      org: 'Community',  steps: 8,  category: 'Data & Parameters', color: 'bk-pink'   },
];

const SHELVES = [
  { label: 'Structure',        books: BOOKS.filter(b => b.category === 'Structure')        },
  { label: 'Geometry & Form',  books: BOOKS.filter(b => b.category === 'Geometry & Form')  },
  { label: 'Data & Parameters',books: BOOKS.filter(b => b.category === 'Data & Parameters') },
];

function getInitials(author) {
  return author
    .split(' ')
    .map(w => w[0])
    .join('');
}

function Book({ book, onBookSelect }) {
  return (
    <div
      className={`book ${book.color}`}
      onClick={() => onBookSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onBookSelect(book)}
      aria-label={`${book.title} by ${book.author}`}
    >
      <span className="book-title-s">{book.title}</span>
      <span className="book-dot" />
      <span className="book-auth-s">{getInitials(book.author)}</span>

      <div className="book-tip">
        <div className="book-tip-title">{book.title}</div>
        <div className="book-tip-author">{book.author} &middot; {book.org}</div>
        <div className="book-tip-steps">{book.steps} steps</div>
        <div className="book-tip-cat">{book.category}</div>
      </div>
    </div>
  );
}

function Shelf({ label, books, onBookSelect }) {
  return (
    <div className="shelf-gap">
      <div className="room-title">{label}</div>
      <div className="shelf-wrap">
        <div className="shelf">
          <div className="bookend bookend-left" />
          {books.map(book => (
            <Book key={book.id} book={book} onBookSelect={onBookSelect} />
          ))}
          <div className="bookend bookend-right" />
        </div>
      </div>
    </div>
  );
}

export default function Library({ onBookSelect }) {
  return (
    <div className="library">
      <h1 className="library-heading">The Dynamo Library</h1>
      <p className="library-sub">Pick a script and start your storytime session.</p>
      {SHELVES.map(shelf => (
        <Shelf
          key={shelf.label}
          label={shelf.label}
          books={shelf.books}
          onBookSelect={onBookSelect}
        />
      ))}
    </div>
  );
}
