import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RichTextRenderer = ({ content, isUser = false }) => {
  const renderInlineFormatting = (text) => {
    if (!text) return null;

    // Handle inline code first (highest priority)
    if (text.includes('`')) {
      const parts = text.split('`');
      return parts.map((part, i) => 
        i % 2 === 1 ? (
          <Chip
            key={i}
            label={part}
            size="small"
            sx={{
              backgroundColor: '#f0f0f0',
              fontFamily: 'monospace',
              mx: 0.5,
              height: 'auto',
              '& .MuiChip-label': {
                px: 1,
                py: 0.5
              }
            }}
          />
        ) : renderBoldAndItalic(part)
      );
    }

    return renderBoldAndItalic(text);
  };

  const renderBoldAndItalic = (text) => {
    if (!text) return null;

    // Handle bold text
    if (text.includes('**')) {
      const parts = text.split('**');
      return parts.map((part, i) => 
        i % 2 === 1 ? (
          <strong key={i}>{renderItalic(part)}</strong>
        ) : renderItalic(part)
      );
    }

    return renderItalic(text);
  };

  const renderItalic = (text) => {
    if (!text) return null;

    // Handle italic text - be more careful about the regex
    if (text.includes('*')) {
      const parts = text.split('*');
      return parts.map((part, i) => 
        i % 2 === 1 ? (
          <em key={i}>{part}</em>
        ) : part
      );
    }

    return text;
  };

  const renderContent = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentCodeBlock = null;
    let currentList = null;
    let listType = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          listType = null;
        }
        continue;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        if (currentCodeBlock) {
          // End of code block
          const codeContent = currentCodeBlock.content;
          const language = currentCodeBlock.language;
          
          elements.push(
            <Paper 
              key={`code-${i}`}
              elevation={2} 
              sx={{ 
                my: 1, 
                p: 2, 
                backgroundColor: '#1e1e1e',
                borderRadius: 2
              }}
            >
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  borderRadius: 4,
                  fontSize: '14px'
                }}
              >
                {codeContent}
              </SyntaxHighlighter>
            </Paper>
          );
          currentCodeBlock = null;
        } else {
          // Start of code block
          const language = line.slice(3).trim();
          currentCodeBlock = { language, content: '' };
        }
        continue;
      }

      // If we're in a code block, add to content
      if (currentCodeBlock) {
        currentCodeBlock.content += line + '\n';
        continue;
      }

      // Handle headings
      if (line.startsWith('#')) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const [, hashes, headingText] = match;
          const level = hashes.length;
          const variant = level === 1 ? 'h4' : level === 2 ? 'h5' : 'h6';
          
          // Close any open list
          if (currentList) {
            elements.push(currentList);
            currentList = null;
            listType = null;
          }
          
          elements.push(
            <Typography 
              key={`heading-${i}`}
              variant={variant} 
              sx={{ 
                mb: 1, 
                mt: 2,
                fontWeight: 'bold',
                color: isUser ? 'primary.main' : 'text.primary'
              }}
            >
              {renderInlineFormatting(headingText)}
            </Typography>
          );
          continue;
        }
      }

      // Handle bullet points - be more specific about the pattern
      if (line.match(/^[-*]\s+/)) {
        const itemText = line.replace(/^[-*]\s+/, '');
        
        if (listType !== 'bullet') {
          if (currentList) {
            elements.push(currentList);
          }
          currentList = (
            <Box key={`list-${i}`} sx={{ mb: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ marginRight: '8px', color: '#666' }}>•</span>
                {renderInlineFormatting(itemText)}
              </Typography>
            </Box>
          );
          listType = 'bullet';
        } else {
          // Add to existing bullet list
          const newItem = (
            <Typography 
              key={`list-item-${i}`}
              variant="body1" 
              sx={{ 
                mb: 0.5,
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ marginRight: '8px', color: '#666' }}>•</span>
              {renderInlineFormatting(itemText)}
            </Typography>
          );
          currentList = React.cloneElement(currentList, {}, [
            ...React.Children.toArray(currentList.props.children),
            newItem
          ]);
        }
        continue;
      }

      // Handle numbered lists
      if (line.match(/^\d+\.\s+/)) {
        const itemText = line.replace(/^\d+\.\s+/, '');
        
        if (listType !== 'numbered') {
          if (currentList) {
            elements.push(currentList);
          }
          currentList = (
            <Box key={`list-${i}`} sx={{ mb: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ marginRight: '8px', color: '#666', minWidth: '20px' }}>1.</span>
                {renderInlineFormatting(itemText)}
              </Typography>
            </Box>
          );
          listType = 'numbered';
        } else {
          // Add to existing numbered list
          const itemNumber = React.Children.count(currentList.props.children) + 1;
          const newItem = (
            <Typography 
              key={`list-item-${i}`}
              variant="body1" 
              sx={{ 
                mb: 0.5,
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ marginRight: '8px', color: '#666', minWidth: '20px' }}>{itemNumber}.</span>
              {renderInlineFormatting(itemText)}
            </Typography>
          );
          currentList = React.cloneElement(currentList, {}, [
            ...React.Children.toArray(currentList.props.children),
            newItem
          ]);
        }
        continue;
      }

      // Close any open list
      if (currentList) {
        elements.push(currentList);
        currentList = null;
        listType = null;
      }

      // Regular text
      elements.push(
        <Typography 
          key={`text-${i}`}
          variant="body1" 
          sx={{ 
            mb: 1,
            lineHeight: 1.6,
            color: isUser ? 'primary.main' : 'text.primary'
          }}
        >
          {renderInlineFormatting(line)}
        </Typography>
      );
    }

    // Close any remaining list
    if (currentList) {
      elements.push(currentList);
    }

    return elements;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {renderContent(content)}
    </Box>
  );
};

export default RichTextRenderer;