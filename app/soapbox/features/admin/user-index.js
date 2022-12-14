import { Set as ImmutableSet, OrderedSet as ImmutableOrderedSet, is } from 'immutable';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { fetchUsers } from 'soapbox/actions/admin';
import ScrollableList from 'soapbox/components/scrollable-list';
import { Column } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account-container';
import { SimpleForm, TextInput } from 'soapbox/features/forms';

const messages = defineMessages({
  heading: { id: 'column.admin.users', defaultMessage: 'Users' },
  empty: { id: 'admin.user_index.empty', defaultMessage: 'No users found.' },
  searchPlaceholder: { id: 'admin.user_index.search_input_placeholder', defaultMessage: 'Who are you looking for?' },
});

class UserIndex extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
    filters: ImmutableSet(['local', 'active']),
    accountIds: ImmutableOrderedSet(),
    total: Infinity,
    pageSize: 50,
    page: 0,
    query: '',
    nextLink: undefined,
  }

  clearState = callback => {
    this.setState({
      isLoading: true,
      accountIds: ImmutableOrderedSet(),
      page: 0,
    }, callback);
  }

  fetchNextPage = () => {
    const { filters, page, query, pageSize, nextLink } = this.state;
    const nextPage = page + 1;

    this.props.dispatch(fetchUsers(filters, nextPage, query, pageSize, nextLink))
      .then(({ users, count, next }) => {
        const newIds = users.map(user => user.id);

        this.setState({
          isLoading: false,
          accountIds: this.state.accountIds.union(newIds),
          total: count,
          page: nextPage,
          nextLink: next,
        });
      })
      .catch(() => { });
  }

  componentDidMount() {
    this.fetchNextPage();
  }

  refresh = () => {
    this.clearState(() => {
      this.fetchNextPage();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { filters, query } = this.state;
    const filtersChanged = !is(filters, prevState.filters);
    const queryChanged = query !== prevState.query;

    if (filtersChanged || queryChanged) {
      this.refresh();
    }
  }

  handleLoadMore = debounce(() => {
    this.fetchNextPage();
  }, 2000, { leading: true });

  updateQuery = debounce(query => {
    this.setState({ query });
  }, 900)

  handleQueryChange = e => {
    this.updateQuery(e.target.value);
  };

  render() {
    const { intl } = this.props;
    const { accountIds, isLoading } = this.state;
    const hasMore = accountIds.count() < this.state.total && this.state.nextLink !== false;

    const showLoading = isLoading && accountIds.isEmpty();

    return (
      <Column label={intl.formatMessage(messages.heading)}>
        <SimpleForm style={{ paddingBottom: 0 }}>
          <TextInput
            onChange={this.handleQueryChange}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
          />
        </SimpleForm>
        <ScrollableList
          scrollKey='user-index'
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={showLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={intl.formatMessage(messages.empty)}
          className='mt-4'
          itemClassName='pb-4'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withDate />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}

export default injectIntl(connect()(UserIndex));