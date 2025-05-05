import type { Tag } from '@/types';
import type { Lead } from '@/types/lead.types';

/**
 * Validates if a script content has properly formatted placeholders
 * @param content The script content to validate
 * @returns An object with isValid flag and error message if invalid
 */
export function validatePlaceholders(content: string): { isValid: boolean; error?: string } {
  if (!content) return { isValid: true };
  
  const openCount = (content.match(/{{/g) || []).length;
  const closeCount = (content.match(/}}/g) || []).length;
  
  if (openCount !== closeCount) {
    return { 
      isValid: false, 
      error: 'Placeholders incorrectly formatted. Make sure all {{ have matching }}' 
    };
  }
  
  const placeholderRegex = /{{([^}]+)}}/g;
  const matches = Array.from(content.matchAll(placeholderRegex));
  
  for (const match of matches) {
    const placeholder = match[1].trim();
    
    if (placeholder === 'name' || placeholder === 'source') {
      continue;
    }
    
    if (placeholder.startsWith('tag:')) {
      const tagId = placeholder.substring(4).trim();
      if (!tagId) {
        return { 
          isValid: false, 
          error: `Invalid tag placeholder: {{${placeholder}}}. Format should be {{tag:ID}}` 
        };
      }
      continue;
    }
    
    return { 
      isValid: false, 
      error: `Unknown placeholder: {{${placeholder}}}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Replaces placeholders in a script with actual lead data
 * @param content The script content with placeholders
 * @param lead The lead data to use for replacements
 * @param tags All available tags to find tag names by ID
 * @returns The content with placeholders replaced by actual values
 */
export function replacePlaceholders(content: string, lead: Lead, tags: Tag[]): string {
  if (!content) return '';
  
  let result = content;
  
  // Substituir {{name}} pelo nome do lead
  result = result.replace(/{{name}}/g, lead.name || '');
  
  // Substituir {{source}} pela fonte do lead
  result = result.replace(/{{source}}/g, lead.source || '');
  
  // Substituir {{tag:ID}} pelo nome da tag correspondente
  const tagRegex = /{{tag:([^}]+)}}/g;
  const tagMatches = Array.from(result.matchAll(tagRegex));
  
  for (const match of tagMatches) {
    const tagId = match[1].trim();
    const tag = tags.find(t => t.id === tagId);
    const replacement = tag ? tag.name : '';
    result = result.replace(match[0], replacement);
  }
  
  return result;
}

/**
 * Format WhatsApp text with markdown-like syntax support
 * @param text Text to format
 * @returns HTML formatted preview
 */
export function formatWhatsAppPreview(text: string): string {
  if (!text) return '';
  
  let formatted = text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<del>$1</del>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
  
  if (formatted.includes('<br>- ') || formatted.includes('<br>* ') || formatted.startsWith('- ') || formatted.startsWith('* ')) {
    const lines = formatted.split('<br>');
    formatted = lines.map(line => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      return line;
    }).join('<br>');
    
    formatted = formatted.replace(/<li>(.*?)<\/li><br><li>/g, '<li>$1</li><li>');
    formatted = formatted.replace(/<li>(.*?)<\/li><br>/g, '<li>$1</li>');
    formatted = formatted.replace(/<li>/g, '<ul><li>');
    formatted = formatted.replace(/<\/li>/g, '</li></ul>');
  }
  
  if (formatted.includes('<br>1. ') || formatted.startsWith('1. ')) {
    const lines = formatted.split('<br>');
    let inList = false;
    
    formatted = lines.map(line => {
      const match = line.match(/^(\d+)\. (.*)$/);
      if (match) {
        if (!inList) {
          inList = true;
          return `<ol><li>${match[2]}</li>`;
        }
        return `<li>${match[2]}</li>`;
      } else if (inList) {
        inList = false;
        return `</ol>${line}`;
      }
      return line;
    }).join('<br>');
    
    if (inList) {
      formatted += '</ol>';
    }
  }
  
  if (formatted.includes('<br>> ') || formatted.startsWith('> ')) {
    const lines = formatted.split('<br>');
    formatted = lines.map(line => {
      if (line.startsWith('> ')) {
        return `<blockquote>${line.substring(2)}</blockquote>`;
      }
      return line;
    }).join('<br>');
  }
  
  return formatted;
}

/**
 * Extrai todos os IDs de tags utilizados nos placeholders de um script
 * @param content O conteúdo do script com placeholders
 * @returns Array de IDs de tags encontrados
 */
export function extractTagIds(content: string): string[] {
  if (!content) return [];
  
  const tagRegex = /{{tag:([^}]+)}}/g;
  const tagMatches = Array.from(content.matchAll(tagRegex));
  
  return tagMatches.map(match => match[1].trim());
}