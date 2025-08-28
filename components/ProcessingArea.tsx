'use client';

import { useEffect, useState } from 'react';
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

export function ProcessingArea() {
  const [output, setOutput] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [replaceDoubleS, setReplaceDoubleS] = useState<boolean>(true);
  const [replaceEmDash, setReplaceEmDash] = useState<boolean>(true);
  const [removeEmojis, setRemoveEmojis] = useState<boolean>(true);
  const [removeHorizontalRules, setRemoveHorizontalRules] = useState<boolean>(true);
  const [reduceItalic, setReduceItalic] = useState<boolean>(false);
  const [reduceBold, setReduceBold] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>('markdown');
  const [exporter, setExporter] = useState<TextExporter | null>(null);

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
  let timeout: NodeJS.Timeout;
  const TIMEOUT_MS = 250;

  async function setupPandocExporter() {
    const exporter = new PandocExporter();
    await exporter.initialize();
    setExporter(exporter);
  }

  function processInput() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (exporter) {
        exporter.setOutputFormat(outputFormat);
        const refiner = new MarkdownRefiner();

        if (replaceDoubleS) refiner.addProcessor(new DoubleSProcessor());
        if (replaceEmDash) refiner.addProcessor(new EmDashProcessor());
        if (reduceBold) refiner.addProcessor(new BoldProcessor());
        if (reduceItalic) refiner.addProcessor(new ItalicProcessor());
        if (removeHorizontalRules) refiner.addProcessor(new HorizontalRulesProcessor());
        if (removeEmojis) refiner.addProcessor(new EmojisProcessor());

        refiner.setExporter(exporter);

        const converted = refiner.refine(input);
        setOutput(converted);
      }
    }, TIMEOUT_MS);
  }

  useEffect(() => {
    setupPandocExporter();
  }, []);

  useEffect(() => {
    processInput();
  }, [
    outputFormat,
    input,
    replaceDoubleS,
    replaceEmDash,
    reduceBold,
    reduceItalic,
    removeEmojis,
    removeHorizontalRules,
  ]);

  return (
    <Container fluid mih={500}>
      <Flex justify="space-evenly" align="center" direction="row" wrap={'wrap'} gap="lg">
        <Container w={'40%'} m={0} p={0}>
          <Textarea
            label="Input"
            placeholder="Paste your **MARKDOWN** text here"
            size="md"
            autosize
            minRows={20}
            maxRows={20}
            miw={500}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
          />
        </Container>
        <Stack>
          <Switch
            checked={replaceDoubleS}
            onChange={(e) => setReplaceDoubleS(e.currentTarget.checked)}
            label="Replace 'ß' with 'ss'"
          />
          <Switch
            checked={replaceEmDash}
            onChange={(e) => setReplaceEmDash(e.currentTarget.checked)}
            label="Replace '—' with '-'"
          />
          <Switch
            checked={removeEmojis}
            onChange={(e) => setRemoveEmojis(e.currentTarget.checked)}
            label="Remove emojis"
          />
          <Switch
            checked={removeHorizontalRules}
            onChange={(e) => setRemoveHorizontalRules(e.currentTarget.checked)}
            label="Remove horizonal rules"
          />
          <Switch
            checked={reduceBold}
            onChange={(e) => setReduceBold(e.currentTarget.checked)}
            label="Reduce amount of bold text"
          />
          <Switch
            checked={reduceItalic}
            onChange={(e) => setReduceItalic(e.currentTarget.checked)}
            label="Reduce amount of cursive text"
          />
          <Select
            label="Output Format"
            value={outputFormat}
            data={availableOutputFormats}
            maxDropdownHeight={100}
            searchable
            onChange={(value) => value && setOutputFormat(value)}
          ></Select>
        </Stack>
        <Container pos={'relative'} w={'40%'} m={0} p={0}>
          <Textarea
            label="Output"
            placeholder="Processed text will appear here"
            size="md"
            autosize
            minRows={20}
            maxRows={20}
            miw={500}
            value={output}
          />
          <Container pos={'absolute'} top={35} right={10} m={0} p={0}>
            <CopyButton value={output} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Container>
        </Container>
      </Flex>
    </Container>
  );
}
