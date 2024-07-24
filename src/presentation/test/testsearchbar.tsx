'use client'

import React, { useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GoogleSearchLocation } from '@/domain/models/serperApi';

const ListItem = React.memo(({ item }: { item: GoogleSearchLocation }) => {
  return <p>{item.name}</p>;
});

const MyVirtualizedList = React.memo(({ items }: { items: GoogleSearchLocation[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />

      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: 'auto', // Make it scroll!
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              className="virtual-item"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListItem item={filteredItems[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default MyVirtualizedList;