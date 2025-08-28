'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import {
  ActionIcon,
  Container,
  CopyButton,
  Flex,
  Select,
  Stack,
  Switch,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { TextExporter } from '@/lib/interfaces';
import { MarkdownRefiner } from '@/lib/markdown-refiner';
import { PandocExporter } from '@/lib/pandoc-exporter';
import { BoldProcessor } from '@/lib/processors/bold-processor';
import { DoubleSProcessor } from '@/lib/processors/double-s-processor';
import { EmDashProcessor } from '@/lib/processors/emdash-processor';
import { EmojisProcessor } from '@/lib/processors/emojis-processor';
import { HorizontalRulesProcessor } from '@/lib/processors/horizontal-rules-processor';
import { ItalicProcessor } from '@/lib/processors/italic-processor';

const availableOutputFormats = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'typst', label: 'Typst' },
  { value: 'latex', label: 'LaTeX' },
  { value: 'html', label: 'HTML' },
  { value: 'asciidoc', label: 'AsciiDoc' },
  { value: 'rst', label: 'ReStructuredText' },
  { value: 'rtf', label: 'Rich Text Format' },
  { value: 'man', label: 'Manpage' },
];

const processorMap = {
  replaceDoubleS: DoubleSProcessor,
  replaceEmDash: EmDashProcessor,
  reduceBold: BoldProcessor,
  reduceItalic: ItalicProcessor,
  removeHorizontalRules: HorizontalRulesProcessor,
  removeEmojis: EmojisProcessor,
};

function usePandocExporter() {
  const [exporter, setExporter] = useState<TextExporter | null>(null);

  useEffect(() => {
    async function initializeExporter() {
      const pandocExporter = new PandocExporter();
      await pandocExporter.initialize();
      setExporter(pandocExporter);
    }
    initializeExporter();
  }, []);

  return exporter;
}

export function ProcessingArea() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('markdown');

  const [refinementOptions, setRefinementOptions] = useState({
    replaceDoubleS: true,
    replaceEmDash: true,
    removeEmojis: true,
    removeHorizontalRules: true,
    reduceItalic: false,
    reduceBold: true,
  });

  const exporter = usePandocExporter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refineAndExportText = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (exporter) {
        exporter.setOutputFormat(outputFormat);
        const refiner = new MarkdownRefiner();

        Object.entries(refinementOptions).forEach(([option, isEnabled]) => {
          if (isEnabled && processorMap[option as keyof typeof processorMap]) {
            const ProcessorClass = processorMap[option as keyof typeof processorMap];
            refiner.addProcessor(new ProcessorClass());
          }
        });

        refiner.setExporter(exporter);
        const converted = refiner.refine(input);
        setOutput(converted);
      }
    }, 250);
  }, [input, outputFormat, refinementOptions, exporter]);

  useEffect(() => {
    refineAndExportText();
  }, [refineAndExportText]);

  const handleOptionChange = (option: keyof typeof refinementOptions, checked: boolean) => {
    setRefinementOptions((prevOptions) => ({
      ...prevOptions,
      [option]: checked,
    }));
  };

  return (
    <Container fluid mih={500}>
      <Flex justify="center" align="center" gap={'xl'} wrap="wrap">
        <div>
          <Textarea
            label="Input"
            placeholder="Paste your **MARKDOWN** text here"
            size="md"
            autosize
            minRows={18}
            maxRows={18}
            miw={500}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
          />
        </div>
        <div>
          <Stack>
            <Switch
              checked={refinementOptions.replaceDoubleS}
              onChange={(e) => handleOptionChange('replaceDoubleS', e.currentTarget.checked)}
              label="Replace 'ß' with 'ss'"
            />
            <Switch
              checked={refinementOptions.replaceEmDash}
              onChange={(e) => handleOptionChange('replaceEmDash', e.currentTarget.checked)}
              label="Replace '—' with '-'"
            />
            <Switch
              checked={refinementOptions.removeEmojis}
              onChange={(e) => handleOptionChange('removeEmojis', e.currentTarget.checked)}
              label="Remove emojis"
            />
            <Switch
              checked={refinementOptions.removeHorizontalRules}
              onChange={(e) => handleOptionChange('removeHorizontalRules', e.currentTarget.checked)}
              label="Remove horizonal rules"
            />
            <Switch
              checked={refinementOptions.reduceBold}
              onChange={(e) => handleOptionChange('reduceBold', e.currentTarget.checked)}
              label="Reduce amount of bold text"
            />
            <Switch
              checked={refinementOptions.reduceItalic}
              onChange={(e) => handleOptionChange('reduceItalic', e.currentTarget.checked)}
              label="Reduce amount of cursive text"
            />
            <Select
              label="Output Format"
              value={outputFormat}
              data={availableOutputFormats}
              maxDropdownHeight={100}
              searchable
              onChange={(value) => value && setOutputFormat(value)}
            />
          </Stack>
        </div>
        <div style={{ position: 'relative' }}>
          <Textarea
            label="Output"
            placeholder="Processed text will appear here"
            size="md"
            autosize
            minRows={18}
            maxRows={18}
            miw={500}
            value={output}
            readOnly
          />
          <div style={{ position: 'absolute', top: 35, right: 10 }}>
            <CopyButton value={output} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        </div>
      </Flex>
    </Container>
  );
}
