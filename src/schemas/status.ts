import { z } from 'zod';

import { htmlToPlaintext, stripCompatibilityFeatures } from 'soapbox/utils/html.ts';

import { accountSchema } from './account.ts';
import { attachmentSchema } from './attachment.ts';
import { cardSchema } from './card.ts';
import { customEmojiSchema } from './custom-emoji.ts';
import { emojiReactionSchema } from './emoji-reaction.ts';
import { eventSchema } from './event.ts';
import { groupSchema } from './group.ts';
import { mentionSchema } from './mention.ts';
import { pollSchema } from './poll.ts';
import { tagSchema } from './tag.ts';
import { dateSchema, filteredArray, htmlSchema } from './utils.ts';

import type { Resolve } from 'soapbox/utils/types.ts';

const statusPleromaSchema = z.object({
  event: eventSchema.nullish().catch(undefined),
  quote: z.literal(null).catch(null),
  quote_visible: z.boolean().catch(true),
});

const statusDittoSchema = z.object({
  external_url: z.string().optional().catch(undefined),
});

const baseStatusSchema = z.object({
  account: accountSchema,
  application: z.object({
    name: z.string(),
    website: z.string().url().nullable().catch(null),
  }).nullable().catch(null),
  bookmark_folder: z.string().nullable().catch(null),
  bookmarked: z.coerce.boolean(),
  card: cardSchema.nullable().catch(null),
  content: htmlSchema().catch({ __html: '' }),
  created_at: dateSchema,
  disliked: z.coerce.boolean(),
  dislikes_count: z.number().catch(0),
  edited_at: z.string().datetime().nullable().catch(null),
  emojis: filteredArray(customEmojiSchema),
  favourited: z.coerce.boolean(),
  favourites_count: z.number().catch(0),
  group: groupSchema.nullable().catch(null),
  in_reply_to_account_id: z.string().nullable().catch(null),
  in_reply_to_id: z.string().nullable().catch(null),
  id: z.string(),
  language: z.string().nullable().catch(null),
  media_attachments: filteredArray(attachmentSchema),
  mentions: filteredArray(mentionSchema),
  muted: z.coerce.boolean(),
  pinned: z.coerce.boolean(),
  pleroma: statusPleromaSchema.optional().catch(undefined),
  ditto: statusDittoSchema.optional().catch(undefined),
  reactions: filteredArray(emojiReactionSchema),
  poll: pollSchema.nullable().catch(null),
  quote: z.literal(null).catch(null),
  quotes_count: z.number().catch(0),
  reblog: z.literal(null).catch(null),
  reblogged: z.coerce.boolean(),
  reblogs_count: z.number().catch(0),
  replies_count: z.number().catch(0),
  sensitive: z.coerce.boolean(),
  spoiler_text: z.string().catch(''),
  tags: filteredArray(tagSchema),
  tombstone: z.object({
    reason: z.enum(['deleted']),
  }).nullable().optional().catch(undefined),
  uri: z.string().url().catch(''),
  url: z.string().url().catch(''),
  visibility: z.string().catch('public'),
  zapped: z.coerce.boolean(),
});

type BaseStatus = z.infer<typeof baseStatusSchema>;
type TransformableStatus = Omit<BaseStatus, 'reblog' | 'quote' | 'pleroma'> & {
  pleroma?: Omit<z.infer<typeof statusPleromaSchema>, 'quote'>;
};

/** Creates search index from the status. */
const buildSearchIndex = (status: TransformableStatus): string => {
  const pollOptionTitles = status.poll ? status.poll.options.map(({ title }) => title) : [];
  const mentionedUsernames = status.mentions.map(({ acct }) => `@${acct}`);

  const fields = [
    status.spoiler_text,
    status.content,
    ...pollOptionTitles,
    ...mentionedUsernames,
  ];

  const searchContent = htmlToPlaintext(fields.join('\n\n')) || '';
  return new DOMParser().parseFromString(searchContent, 'text/html').documentElement.textContent || '';
};

type Translation = {
  content: { __html: string };
  provider: string;
}

/** Add internal fields to the status. */
const transformStatus = <T extends TransformableStatus>({ pleroma, ...status }: T) => {
  status.content.__html = stripCompatibilityFeatures(status.content.__html);

  return {
    ...status,
    approval_status: 'approval' as const,
    expectsCard: false,
    event: pleroma?.event,
    filtered: [],
    hidden: false,
    pleroma: pleroma ? (() => {
      const { event, ...rest } = pleroma;
      return rest;
    })() : undefined,
    search_index: buildSearchIndex(status),
    showFiltered: false, // TODO: this should be removed from the schema and done somewhere else
    translation: undefined as Translation | undefined,
  };
};

const embeddedStatusSchema = baseStatusSchema
  .transform(transformStatus)
  .nullable()
  .catch(null);

const statusSchema = baseStatusSchema.extend({
  quote: embeddedStatusSchema,
  reblog: embeddedStatusSchema,
  pleroma: statusPleromaSchema.extend({
    quote: embeddedStatusSchema,
    emoji_reactions: filteredArray(emojiReactionSchema),
  }).optional().catch(undefined),
}).transform(({ pleroma, ...status }) => {
  return {
    ...status,
    event: pleroma?.event,
    quote: pleroma?.quote || status.quote || null,
    reactions: pleroma?.emoji_reactions || status.reactions || null,
    // There's apparently no better way to do this...
    // Just trying to remove the `event` and `quote` keys from the object.
    pleroma: pleroma ? (() => {
      const { event, quote, emoji_reactions, ...rest } = pleroma;
      return rest;
    })() : undefined,
  };
}).transform(transformStatus);

type Status = Resolve<z.infer<typeof statusSchema>>;

export { statusSchema, type Status };
