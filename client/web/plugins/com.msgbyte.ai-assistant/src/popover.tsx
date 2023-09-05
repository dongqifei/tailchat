import React from 'react';
import { Translate } from './translate';
import {
  useAsyncRequest,
  useConverseMessageContext,
  getCachedUserInfo,
  getMessageTextDecorators,
} from '@capital/common';
import {
  LoadingSpinner,
  useChatInputActionContext,
  Tag,
  Button,
  Divider,
} from '@capital/component';
import axios from 'axios';
import styled from 'styled-components';
import {
  improveTextPrompt,
  longerTextPrompt,
  shorterTextPrompt,
  summaryMessagesPrompt,
  translateTextPrompt,
} from './prompt';

const Root = styled.div`
  padding: 0.5rem;
  max-width: 300px;
`;

const Tip = styled.div`
  margin-bottom: 4px;
`;

const Answer = styled.pre`
  white-space: pre-wrap;
  max-height: 50vh;
  overflow: auto;
`;

const ActionButton = styled.div`
  min-width: 180px;
  padding: 4px 6px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-bottom: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const AssistantPopover: React.FC<{
  onCompleted: () => void;
}> = React.memo((props) => {
  const { messages } = useConverseMessageContext();
  const { message, setMessage } = useChatInputActionContext();
  const [{ loading, value }, handleCallAI] = useAsyncRequest(
    async (question: string) => {
      // TODO: wait for replace
      // const { data } = await axios.post('https://yyejoq.laf.dev/chatgpt', {
      //   question,
      // });

      const { data } = await axios.post(
        'http://192.168.128.68:8001/v1/chat-messages',
        {
          inputs: {},
          query: question,
          response_mode: 'blocking',
          conversation_id: '',
          user: 'abc-123',
        },
        {
          headers: {
            Authorization: 'Bearer app-UhUK3GKvfi6Rryvvlrt5Tkuf',
            'Content-Type': 'application/json',
          },
        }
      );

      const wrap_data = { ...data, result: true };

      return wrap_data;
    },
    []
  );

  if (loading) {
    return (
      <Root>
        <LoadingSpinner />
      </Root>
    );
  }

  return (
    <Root>
      <div>
        {typeof value === 'object' && (
          <>
            {value.result ? (
              <div>
                <Answer>{value.answer}</Answer>
                <div>
                  <Tag color="green">
                    {Translate.usage}: {value.usage}ms
                  </Tag>

                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setMessage(value.answer);
                      props.onCompleted();
                    }}
                  >
                    {Translate.apply}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div>{Translate.serviceBusy}</div>
                <Tag color="red">{Translate.callError}</Tag>
              </div>
            )}

            <Divider />
          </>
        )}
      </div>

      <Tip>{Translate.helpMeTo}</Tip>

      {typeof message === 'string' && message.length > 0 && (
        <>
          <ActionButton
            onClick={() => handleCallAI(improveTextPrompt + message)}
          >
            {Translate.improveText}
          </ActionButton>
          <ActionButton
            onClick={() => handleCallAI(shorterTextPrompt + message)}
          >
            {Translate.makeShorter}
          </ActionButton>
          <ActionButton
            onClick={() => handleCallAI(longerTextPrompt + message)}
          >
            {Translate.makeLonger}
          </ActionButton>
          <ActionButton
            onClick={() => handleCallAI(translateTextPrompt + message)}
          >
            {Translate.translateInputText}
          </ActionButton>
        </>
      )}

      <ActionButton
        onClick={async () => {
          const plainMessages = (
            await Promise.all(
              [...messages]
                .filter((item) => !item.hasRecall) // filter recalled message
                .slice(messages.length - 30, messages.length) // get last 30 message, too much will throw error
                .map(
                  async (item) =>
                    `${
                      (
                        await getCachedUserInfo(item.author)
                      ).nickname
                    }: ${getMessageTextDecorators().serialize(
                      item.content ?? ''
                    )}`
                )
            )
          ).join('\n');

          handleCallAI(summaryMessagesPrompt + plainMessages);
        }}
      >
        {Translate.summaryMessages}
      </ActionButton>
    </Root>
  );
});
AssistantPopover.displayName = 'AssistantPopover';
