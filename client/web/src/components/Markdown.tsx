import { markAbsoluteUrl } from '@/utils/url-helper';
import React, { useCallback, useMemo } from 'react';
import { isValidStr } from 'tailchat-shared';
import { Loadable } from './Loadable';
import { Image } from 'tailchat-design';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './Markdown.less';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReactMarkdown = Loadable(() => import('react-markdown'));

export const Markdown: React.FC<{
  raw: string;
  baseUrl?: string;
}> = React.memo(({ raw, baseUrl }) => {
  const transformUrl = useCallback(
    (url: string) => {
      if (!isValidStr(baseUrl)) {
        return url;
      }

      return new URL(url, markAbsoluteUrl(baseUrl)).href;
    },
    [baseUrl]
  );

  /**
   * Markdown自定义渲染组件
   */
  const components = useMemo<
    React.ComponentProps<typeof ReactMarkdown>['components']
  >(
    () => ({
      img: (props) => (
        <Image
          src={props.src}
          preview={true}
          width={props.width}
          height={props.height}
        />
      ),
    }),
    []
  );

  return (
    <ReactMarkdown
      className="tailchat-markdown"
      transformImageUri={(src) => transformUrl(src)}
      transformLinkUri={(href) => transformUrl(href)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      linkTarget="_blank"
      skipHtml={false}
      components={components}
    >
      {raw}
    </ReactMarkdown>
  );
});
Markdown.displayName = 'Markdown';
