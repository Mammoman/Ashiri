import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';

export function SortableGalleryItem({ id, url, folder, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
    flex: '0 0 160px',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    aspectRatio: '3/4',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="gallery-admin-item"
    >
      <img
        src={url}
        alt="Gallery Upload"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      
      {/* Overlay with info and delete */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        opacity: isDragging ? 0 : 1, // hide overlay when dragging
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div 
            {...attributes} 
            {...listeners} 
            style={{ 
              background: 'rgba(255,255,255,0.8)',
              color: '#334155',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab'
            }}
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
          <button
            onClick={() => onDelete(id)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            title="Delete Image"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(4px)',
            color: 'white', 
            fontSize: '0.65rem',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 500,
          }}>
            {folder}/
          </span>
        </div>
      </div>
    </div>
  );
}
