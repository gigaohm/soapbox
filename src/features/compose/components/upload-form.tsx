import clsx from 'clsx';
import React, { useCallback, useRef } from 'react';

import { changeMediaOrder } from 'soapbox/actions/compose';
import { HStack } from 'soapbox/components/ui';
import { useAppDispatch, useCompose } from 'soapbox/hooks';

import Upload from './upload';
import UploadProgress from './upload-progress';

import type { Attachment as AttachmentEntity } from 'soapbox/types/entities';

interface IUploadForm {
  composeId: string;
  onSubmit(): void;
}

const UploadForm: React.FC<IUploadForm> = ({ composeId, onSubmit }) => {
  const dispatch = useAppDispatch();

  const mediaIds = useCompose(composeId).media_attachments.map((item: AttachmentEntity) => item.id);

  const dragItem = useRef<string | null>();
  const dragOverItem = useRef<string | null>();

  const handleDragStart = useCallback((id: string) => {
    dragItem.current = id;
  }, [dragItem]);

  const handleDragEnter = useCallback((id: string) => {
    dragOverItem.current = id;
  }, [dragOverItem]);

  const handleDragEnd = useCallback(() => {
    dispatch(changeMediaOrder(composeId, dragItem.current!, dragOverItem.current!));
    dragItem.current = null;
    dragOverItem.current = null;
  }, [dragItem, dragOverItem]);

  return (
    <div className='overflow-hidden'>
      <UploadProgress composeId={composeId} />

      <HStack wrap className={clsx('overflow-hidden', mediaIds.size !== 0 && 'p-1')}>
        {mediaIds.map((id: string) => (
          <Upload
            id={id}
            key={id}
            composeId={composeId}
            onSubmit={onSubmit}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))}
      </HStack>
    </div>
  );
};

export default UploadForm;
