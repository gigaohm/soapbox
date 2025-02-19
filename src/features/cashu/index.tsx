import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { HTTPError } from 'soapbox/api/HTTPError.ts';
import Button from 'soapbox/components/ui/button.tsx';
import { Column } from 'soapbox/components/ui/column.tsx';
import FormActions from 'soapbox/components/ui/form-actions.tsx';
import FormGroup from 'soapbox/components/ui/form-group.tsx';
import Form from 'soapbox/components/ui/form.tsx';
import Input from 'soapbox/components/ui/input.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Streamfield, { StreamfieldComponent } from 'soapbox/components/ui/streamfield.tsx';
import { useCashu } from 'soapbox/features/cashu/hooks/useCashu.ts';
import toast from 'soapbox/toast.tsx';

const messages = defineMessages({
  title: { id: 'cashu.wallet.create', defaultMessage: 'Create Cashu Wallet' },
  mints: { id: 'cashu.wallet.mints', defaultMessage: 'Your mints' },
  nutzap_info: { id: 'cashu.nutzap.info', defaultMessage: 'Your nutzap info' },
  swap_cashu: { id: 'cashu.nutzap.swap', defaultMessage: 'Swap your Cashu' },
  mint_placeholder:  { id: 'cashu.wallet.mint_placeholder', defaultMessage: 'https://<mint-url>' },
  submit_success: { id: 'generic.saved', defaultMessage: 'Saved!' },
  create_cashu_quote: { id: 'cashu.quote', defaultMessage: 'Create Cashu Quote' },
  get_cashu_quote_state: { id: 'cashu.quote.state', defaultMessage: 'Create Cashu Quote' },
  mint_the_mint: { id: 'cashu.quote.mint', defaultMessage: 'Mint the Mint' },
  get_wallet: { id: 'cashu.get_wallet', defaultMessage: 'Get wallet' },
});

const Cashu = () => {
  const intl = useIntl();
  const { createWallet, createNutzapInfo, swapCashuToWallet, createQuote, getQuoteState, mintTheMint, getWallet } = useCashu();

  const [mints, setMints] = useState<string[]>([]);

  const updateData = (values: string[]) => {
    setMints(values);
  };

  const handleStreamItemChange = () => {
    return (values: string[]) => {
      updateData(values);
    };
  };

  const deleteStreamItem = () => {
    return (i: number) => {
      setMints(prevData => {
        return [...prevData ].toSpliced(i, 1);
      });
    };
  };

  const handleAddMint = (): void => {
    setMints(prevData => [...prevData, '']);
  };

  const handleCreateWalletSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    createWallet({ mints }, {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleCreateNutzapInfoSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    createNutzapInfo({ mints, relays: [] }, {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleSwapWalletSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    swapCashuToWallet(undefined, {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleMintQuote: React.FormEventHandler = async (event) => {
    event.preventDefault();
    createQuote({ mint: mints[0], amount: 20 }, {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleGetMintQuoteState: React.FormEventHandler = async (event) => {
    event.preventDefault();
    getQuoteState(mints[0], {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleMintTheMintQuoteState: React.FormEventHandler = async (event) => {
    event.preventDefault();
    mintTheMint(mints[0], {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  const handleGetWallet: React.FormEventHandler = async (event) => {
    event.preventDefault();
    getWallet(undefined, {
      onSuccess: async () => {
        toast.success(messages.submit_success);
      },
      onError: async (err) => {
        if (err instanceof HTTPError) {
          try {
            const { error } = await err.response.json();
            if (typeof error === 'string') {
              toast.error(error);
              return;
            }
          } catch { /* empty */ }
        }
        toast.error(err.message);
      },
    });
  };

  return (
    <Column label={intl.formatMessage(messages.title)}>
      <Form onSubmit={handleCreateWalletSubmit}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.mints)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>
      <Form onSubmit={handleCreateNutzapInfoSubmit}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.nutzap_info)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>
      <Form onSubmit={handleSwapWalletSubmit}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.swap_cashu)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>

      <Form onSubmit={handleMintQuote}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.create_cashu_quote)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>

      <Form onSubmit={handleGetMintQuoteState}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.get_cashu_quote_state)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>

      <Form onSubmit={handleMintTheMintQuoteState}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.mint_the_mint)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>

      <Form onSubmit={handleGetWallet}>
        <Stack space={4}>

          <Streamfield
            label={intl.formatMessage(messages.get_wallet)}
            component={CashuInput}
            values={mints}
            onChange={handleStreamItemChange()}
            onAddItem={handleAddMint}
            onRemoveItem={deleteStreamItem()}
          />

          <FormActions>
            <Button to='/settings' theme='tertiary'>
              <FormattedMessage id='common.cancel' defaultMessage='Cancel' />
            </Button>

            <Button theme='primary' type='submit'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Stack>
      </Form>
    </Column>
  );
};

type Mint = string

const CashuInput: StreamfieldComponent<Mint> = ({ value, onChange }) => {
  const intl = useIntl();

  const handleChange = (): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      onChange(e.currentTarget.value);
    };
  };

  return (
    <Stack space={3} grow className='my-2'>

      <FormGroup>
        <Input
          type='text'
          outerClassName='grow'
          value={value}
          onChange={handleChange()}
          placeholder={intl.formatMessage(messages.mint_placeholder)}
        />
      </FormGroup>

    </Stack>
  );
};

export default Cashu;
