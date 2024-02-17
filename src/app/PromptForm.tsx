import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  FieldCheckbox,
  FieldInput,
  FieldTextarea,
  Form,
  FormControls,
  FormElement,
  Modal,
} from '@theme';
import { IconName } from '../theme/SVG/icons';
import ShareBenchmarkResults from '@app/ShareBenchmarkResults';

interface FormData {
  content: string;
  emojis: boolean;
  hashtags: string;
}

const generatePrompt = (data: FormData) => {
  const promptLines = [
    'Write a Tweet (max. 280 Characters) about the following:',
  ];
  promptLines.push(data.content);
  promptLines.push('');
  promptLines.push(
    data.emojis ? 'It should include Emojis' : 'Do not include emojis'
  );
  data.hashtags &&
    promptLines.push(
      `It should contain the following hashtags: ${data.hashtags}`
    );
  promptLines.push(
    'Only return the Tweet content. Do not return introductory text.'
  );

  return promptLines.join('\n');
};

const PromptForm: React.FC<{
  generate: (
    prompt: string,
    rememberPreviousConversation?: boolean
  ) => Promise<string>;
  disabled: boolean;
  benchmarkTest?: boolean;
  setBenchmarkTest: (benchmarkTest?: boolean) => void;
  setShareResultsModal: (modal?: boolean) => void;
}> = ({
  generate,
  disabled,
  benchmarkTest = false,
  setBenchmarkTest = () => {},
  setShareResultsModal = () => {},
}) => {
  const [benchmarkTestRunning, setBenchmarkTestRunning] =
    React.useState<boolean>(false);
  const methods = useForm<FormData>({
    defaultValues: {
      content: '',
      emojis: true,
      hashtags: '',
    },
  });

  React.useEffect(() => {
    if (benchmarkTest && !benchmarkTestRunning) {
      setBenchmarkTestRunning(benchmarkTest);
      methods.setValue('content', 'I am trying out LLMs in the browser');
      methods.setValue('emojis', true);
      methods.setValue('hashtags', 'LLM, WebAI');
      generate(
        generatePrompt({
          content: 'I am trying out LLMs in the browser',
          emojis: true,
          hashtags: 'LLM, WebAI',
        })
      ).then(() => {
        setBenchmarkTestRunning(false);
        setBenchmarkTest(false);
        setShareResultsModal(true);
      });
    }
  }, [benchmarkTest]);

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit((data: FormData) => {
          generate(generatePrompt(data));
        })}
      >
        <FormElement
          label="What will you Tweet be about?"
          Input={FieldTextarea}
          name="content"
          disabled={disabled}
        />
        <FormElement
          label="Hashtags"
          Input={FieldInput}
          name="hashtags"
          disabled={disabled}
        />
        <FormElement
          label="Include Emojis"
          Input={FieldCheckbox}
          name="emojis"
          disabled={disabled}
        />
        <FormControls
          disabled={disabled}
          loading={disabled}
          align="right"
          value="Generate"
          icon={IconName.SEND}
        />
      </Form>
    </FormProvider>
  );
};

export default PromptForm;
