import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

const { height, width } = Dimensions.get('screen');
export const SCREEN_NAME = 'simplein.BottomSelect';

export const openSelect = (passProps = {}, style = {}) =>
  Navigation.showLightBox({
    screen: SCREEN_NAME, // unique ID registered with Navigation.registerScreen
    passProps,
    style: {
      backgroundBlur: 'light',
      ...style,
    },
  });

function makeData(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.toArray ? data.toArray() : data;
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'purple',
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(237,237,237,1)',
  },

  label: {
    color: 'purple',
    fontWeight: '500',
    fontSize: 33,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      loading: false,
      data: makeData(props.data),
      paddingTop: new Animated.Value(height * 0.3),
    };
    this.handleHideAction = this.handleHideAction.bind(this);
    this.refresh = this.refresh.bind(this);
    this.extractId = this.extractId.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.getValue = this.getValue.bind(this);
    this.filter = this.filter.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }


  componentDidMount() {
    this.mounted = true;
  }
  componentWillReceiveProps(props) {
    if (props === this.props) return;

    if (this.list) this.list.scrollToItem(0);
    if (props.data !== this.props.data) {
      this.setState({ data: makeData(props.data) });
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }


  onFocus() {
    if (!this.mounted) return;
    Animated.timing(this.state.paddingTop, {
      toValue: 60, // or whatever value
      duration: 400,
    }).start(() => this.setState({ isFocused: true }));
  }

  onBlur() {
    if (!this.mounted) return;
    Animated.timing(this.state.paddingTop, {
      toValue: height * 0.3, // or whatever value
      duration: 400,
    }).start(() => this.setState({ isFocused: false }));
  }
  getValue(item = {}) {
    if (item) {
      if (this.props.value in item) return item[this.props.value];
      if (item.get) return item.get(this.props.value);
    }
    console.warn('getting value of malformed item', item, this);
    return '';
  }

  filter(text) {
    const keyword = String(text).toLowerCase().replace(/\s/gi, '');
    console.log('filtering', keyword);
    this.setState({ data: this.props.data.filter((item) => {
      const n = String(this.getValue(item)).toLowerCase().replace(/\s/gi, '');
      return n.indexOf(keyword) > -1;
    }) });
  }

  refresh() {
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 2000);
  }
  handleHideAction() {
    this.props.onChange(this.state.item || null);
    this.mounted = false;
    this.props.navigator.dismissLightBox();
  }
  extractId(item = {}) {
    if (typeof this.props.id === 'function') return this.props.id(item);
    if (item.get) return item.get(this.props.id);
    return this.props.id in item ? item[this.props.id] : `${Math.random()}random_key`;
  }
  renderItem({ item }) {
    if (typeof this.props.renderItem === 'function') return this.props.renderItem(item);
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderBottomColor: 'purple' }}
        onPress={() => this.setState(
          { item },
          this.handleHideAction,
        )}
      >
        <Text
          style={[
            styles.label,
            { textAlign: 'center', padding: 20, fontSize: 18 },
          ]}
        >
          {this.getValue(item)}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    const { paddingTop } = this.state;

    return (
      <TouchableOpacity onPress={this.handleHideAction} >
        <Animated.View style={{ flexDirection: 'column', height, paddingTop, width }}>
          <View style={{ backgroundColor: '#FFF' }}>
            <TextInput
              returnKeyType="search"
              blurOnSubmit
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              clearButtonMode={'always'}
              spellCheck={false}
              autoCorrect={false}
              autoCapitalize={'none'}
              onChangeText={this.filter}
              placeholder={this.props.name || 'Filter List'}
              name="search"
              style={[styles.input]}
            />
          </View>
          <FlatList
            ref={list => (this.list = list)}
            onRefresh={this.refresh}
            refreshing={this.state.loading}
            keyExtractor={this.extractId}
            data={this.state.data}
            renderItem={this.renderItem}
            style={{ flex: 1, backgroundColor: '#FFF' }}

          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired, // eslint-disable-line
  onChange: PropTypes.func.isRequired,
  navigator: PropTypes.shape({
    dismissLightBox: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};
Select.displayName = 'Bootsheet Select';
Select.defaultProps = {
  name: 'search list',
  value: 'id',
  data: [],
  onChange: console.warn,
  id: 'id',
  renderItem: false,
};

export default Select;
