import { use, useEffect, useState } from 'react';
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
import { Refiner } from '@/lib/interfaces';
import { MarkdownRefiner } from '@/lib/markdown-refiner';
import { PandocExporter } from '@/lib/pandoc-exporter';
import { DoubleSProcessor } from '@/lib/processors/double-s-processor';
import { MarkdownBoldProcessor } from '@/lib/processors/markdown-bold-processor';

export function ProcessingArea() {
  const [output, setOutput] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('markdown');
  const availableOutputFormats = [
    { value: 'markdown', label: 'Markdown' },
    { value: 'html', label: 'HTML' },
    { value: 'typst', label: 'Typst' },
    { value: 'latex', label: 'LaTeX' },
    { value: 'rst', label: 'ReStructuredText' },
    { value: 'rtf', label: 'Rich Text Format' },
    { value: 'asciidoc', label: 'AsciiDoc' },
    { value: 'man', label: 'Manpage' },
  ];

  const [refiner, setRefiner] = useState<Refiner | null>(null);

  async function setupRefiner() {
    const exporter = new PandocExporter();
    await exporter.initialize();

    const refiner = new MarkdownRefiner()
      .addProcessor(new DoubleSProcessor())
      .addProcessor(new MarkdownBoldProcessor())
      .setExporter(exporter);

    setRefiner(refiner);
  }

  useEffect(() => {
    setupRefiner();
  }, []);

  useEffect(() => {
    processInput();
  }, [outputFormat, input]);

  function processInput() {
    if (refiner) {
      refiner.getExporter().setOutputFormat(outputFormat);
      setOutput(refiner.refine(input));
    }
  }

  return (
    <Container fluid mih={500}>
      <Flex justify="space-evenly" align="center" direction="row" wrap={'wrap'} gap="lg">
        <Textarea
          label="Input"
          placeholder="Paste the text to be processed here"
          size="md"
          autosize
          minRows={20}
          miw={500}
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
        />
        <Stack>
          <Switch defaultChecked label="Replace 'ß' with 'ss'" />
          <Switch label="Reduce amount of bold text" />
          <Select
            label="Output Format"
            value={outputFormat}
            data={availableOutputFormats}
            searchable
            onChange={(value) => value && setOutputFormat(value)}
          ></Select>
        </Stack>
        <Container pos={'relative'} m={0} p={0}>
          <Textarea
            label="Output"
            placeholder="Processed text will appear here"
            size="md"
            autosize
            minRows={20}
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
