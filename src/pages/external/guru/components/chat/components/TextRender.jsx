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
              backgroundColor: '#605e5e',
              color: '#fff',
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
    let lastListNumber = 0;
    let paragraphBuffer = [];

    const flushParagraph = (idx) => {
      if (paragraphBuffer.length) {
        elements.push(
          <Typography
            key={`p-${idx}-${Math.random()}`}
            variant="body1"
            sx={{
              mb: 1,
              color: '#fff',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {renderInlineFormatting(paragraphBuffer.join(' '))}
          </Typography>
        );
        paragraphBuffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      let rawLine = lines[i];
      let line = rawLine.trim();

      // Handle code blocks
      if (line.startsWith('```')) {
        flushParagraph(i);
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          listType = null;
        }
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

      // If in a code block, preserve original spacing
      if (currentCodeBlock) {
        currentCodeBlock.content += rawLine + '\n';
        continue;
      }

      // Handle headings
      if (line.startsWith('#')) {
        flushParagraph(i);
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          listType = null;
        }
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const [, hashes, headingText] = match;
          const level = hashes.length;
          const variant = level === 1 ? 'h4' : level === 2 ? 'h5' : 'h6';
          elements.push(
            <Typography 
              key={`heading-${i}`}
              variant={variant} 
              sx={{ 
                mb: 1, 
                mt: 2,
                fontWeight: 'bold',
                color: isUser ? '#fff' : '#fff'
              }}
            >
              {renderInlineFormatting(headingText)}
            </Typography>
          );
          continue;
        }
      }

      // Handle bullet points
      if (/^[-*]\s+/.test(line)) {
        flushParagraph(i);
        const itemText = line.replace(/^[-*]\s+/, '');
        if (listType !== 'bullet') {
          if (currentList) elements.push(currentList);
          currentList = (
            <Box key={`list-${i}`} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <span style={{ marginRight: '8px', color: '#fff', flexShrink: 0 }}>•</span>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderInlineFormatting(itemText)}
                </Typography>
              </Box>
            </Box>
          );
          listType = 'bullet';
        } else {
          // Add to existing bullet list
          const newItem = (
            <Box key={`list-item-${i}`} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
              <span style={{ marginRight: '8px', color: '#fff', flexShrink: 0 }}>•</span>
              <Typography
                variant="body1"
                sx={{
                  color: '#fff',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {renderInlineFormatting(itemText)}
              </Typography>
            </Box>
          );
          currentList = React.cloneElement(currentList, {}, [
            ...React.Children.toArray(currentList.props.children),
            newItem
          ]);
        }
        listType = 'bullet';
        continue;
      }

      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        flushParagraph(i);
        const thisNumber = parseInt(numberedMatch[1], 10);
        const itemText = numberedMatch[2];
        if (listType !== 'numbered' || thisNumber !== lastListNumber + 1) {
          if (currentList) elements.push(currentList);
          currentList = (
            <Box key={`list-${i}`} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <span style={{ marginRight: '8px', color: '#fff', minWidth: '20px', flexShrink: 0 }}>{thisNumber}.</span>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderInlineFormatting(itemText)}
                </Typography>
              </Box>
            </Box>
          );
          listType = 'numbered';
          lastListNumber = thisNumber;
        } else {
          // Add to existing numbered list
          const newItem = (
            <Box key={`list-item-${i}`} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
              <span style={{ marginRight: '8px', color: '#fff', minWidth: '20px', flexShrink: 0 }}>{thisNumber}.</span>
              <Typography
                variant="body1"
                sx={{
                  color: '#fff',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {renderInlineFormatting(itemText)}
              </Typography>
            </Box>
          );
          currentList = React.cloneElement(currentList, {}, [
            ...React.Children.toArray(currentList.props.children),
            newItem
          ]);
          lastListNumber = thisNumber;
        }
        listType = 'numbered';
        continue;
      }

      // Empty line: flush paragraph and close list
      if (!line) {
        flushParagraph(i);
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          listType = null;
          lastListNumber = 0;
        }
        continue;
      }

      // Otherwise, buffer as paragraph text
      if (currentList) {
        elements.push(currentList);
        currentList = null;
        listType = null;
        lastListNumber = 0;
      }
      paragraphBuffer.push(line);
    }

    // Flush any remaining paragraph or list
    flushParagraph(lines.length);
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