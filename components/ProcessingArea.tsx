'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { useClipboard, useHotkeys } from '@mantine/hooks';
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

async function getClipboardContents() {
  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}

function getWordCount(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function ProcessingArea() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('markdown');
  const [wordCount, setWordCount] = useState<number>(0);

  const [refinementOptions, setRefinementOptions] = useState({
    replaceDoubleS: true,
    replaceEmDash: true,
    removeEmojis: true,
    removeHorizontalRules: true,
    reduceItalic: true,
    reduceBold: true,
  });

  const exporter = usePandocExporter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clipboard = useClipboard();
  useHotkeys(
    [
      ['shift+ctrl+c', () => clipboard.copy(output)],
      ['shift+ctrl+v', () => getClipboardContents().then((text) => text && setInput(text))],
    ],
    []
  );

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
        setWordCount(getWordCount(input));
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
      <Grid>
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <Textarea
            label="Input"
            placeholder="Paste your **MARKDOWN** text here"
            size="md"
            autosize
            minRows={18}
            maxRows={18}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 'content' }}>
          <Center h={'100%'} m={'md'}>
            <Stack>
              <Switch
                checked={refinementOptions.replaceDoubleS}
                onChange={(e) => handleOptionChange('replaceDoubleS', e.currentTarget.checked)}
                label="Replace 'ß' with 'ss'"
              />
              <Switch
                checked={refinementOptions.replaceEmDash}
                onChange={(e) => handleOptionChange('replaceEmDash', e.currentTarget.checked)}
                label="Replace '—' with ','"
              />
              <Switch
                checked={refinementOptions.removeEmojis}
                onChange={(e) => handleOptionChange('removeEmojis', e.currentTarget.checked)}
                label="Remove emojis"
              />
              <Switch
                checked={refinementOptions.removeHorizontalRules}
                onChange={(e) =>
                  handleOptionChange('removeHorizontalRules', e.currentTarget.checked)
                }
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
                label="Reduce amount of italic text"
              />
              <Select
                label="Output Format"
                value={outputFormat}
                data={availableOutputFormats}
                maxDropdownHeight={120}
                searchable
                onChange={(value) => value && setOutputFormat(value)}
              />
            </Stack>
          </Center>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <Textarea
              label="Output"
              placeholder="Processed text will appear here"
              size="md"
              autosize
              minRows={18}
              maxRows={18}
              value={output}
              readOnly
            />
            <div style={{ position: 'absolute', top: 35, right: 10 }}>
              <Tooltip label={clipboard.copied ? 'Copied' : 'Copy'} withArrow position="right">
                <Button
                  variant="light"
                  size="xs"
                  color={clipboard.copied ? 'teal' : 'gray'}
                  onClick={() => clipboard.copy(output)}
                >
                  {clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </Button>
              </Tooltip>
            </div>
            <Flex justify="flex-end" mt={5} mr={5}>
              <Text size={'xs'}>Word Count: {wordCount}</Text>
            </Flex>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
