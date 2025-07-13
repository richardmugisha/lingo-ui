import React, { useMemo, useEffect } from 'react';
import "./Toolbar.css";
import { Button } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const STANDARD_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48];
const MIN_SIZE = 8;
const MAX_SIZE = 72;

const Toolbar = ({ storySettings, setStorySettings }) => {
  // Log true post‑update fontSize for sanity
  useEffect(() => {
    console.log('fontSize →', storySettings.typeSettings.fontSize);
  }, [storySettings.typeSettings.fontSize]);

  const changeFontSize = delta => {
    setStorySettings(prev => {
      const curr = prev.typeSettings?.fontSize ?? 16;
      // clamp to [8,72]
      const next = Math.min(Math.max(curr + delta, MIN_SIZE), MAX_SIZE);
      return prev.rebuild({
        typeSettings: {
          ...prev.typeSettings,
          fontSize: next,
        },
      });
    });
  };

  // force number
  const fontSize = Number(storySettings.typeSettings?.fontSize ?? 16);

  // ensure select always has an <option> matching current fontSize
  const fontOptions = useMemo(() => {
    if (STANDARD_SIZES.includes(fontSize)) return STANDARD_SIZES;
    return [...STANDARD_SIZES, fontSize].sort((a, b) => a - b);
  }, [fontSize]);

  return (
    <article className="story-toolbar">
      {/* font-family */}
      <select
        value={storySettings.typeSettings?.fontFamily || "Roboto, sans-serif"}
        onChange={e =>
          setStorySettings(prev =>
            prev.rebuild({
              typeSettings: {
                ...prev.typeSettings,
                fontFamily: e.target.value,
              },
            })
          )
        }
      >
        <option value="Roboto, sans-serif">Roboto</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Times New Roman, Times, serif">Times New Roman</option>
        <option value="Arial, Helvetica, sans-serif">Arial</option>
        <option value="'Courier New', Courier, monospace">Courier New</option>
      </select>

      {/* font-size controls */}
      <div>
        <Button
          variant="outlined"
          color="info"
          startIcon={<Remove />}
          onClick={() => changeFontSize(-1)}
        />

        <select
          value={fontSize}
          onChange={e =>
            setStorySettings(prev =>
              prev.rebuild({
                typeSettings: {
                  ...prev.typeSettings,
                  fontSize: Number(e.target.value),
                },
              })
            )
          }
          style={{ margin: '0 1em' }}
        >
          {fontOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <Button
          variant="outlined"
          color="info"
          startIcon={<Add />}
          onClick={() => changeFontSize(1)}
        />
      </div>

      {/* line-height */}
      <select
        value={storySettings.typeSettings?.lineHeight ?? 2}
        onChange={e =>
          setStorySettings(prev =>
            prev.rebuild({
              typeSettings: {
                ...prev.typeSettings,
                lineHeight: Number(e.target.value),
              },
            })
          )
        }
      >
        <option value={2}>Single</option>
        <option value={2.5}>1.15</option>
        <option value={3}>1.5x</option>
        <option value={3.5}>Double</option>
      </select>
    </article>
  );
};

export default Toolbar;
