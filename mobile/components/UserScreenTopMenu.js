import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { renderers } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import PointsHandler from './PointsHandler';
import ModifyUser from './ModifyUser';
import { getHeaderProps } from 'src/utils/device';

export default function UserScreenTopMenu({ user: inUser }) {
  const [adjustmentVisible, setAdjustmentVisible] = useState(false);
  const [modifyUserVisible, setModifyUserVisible] = useState(false);

  const menuTriggerStyles = {
    triggerWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 20,
      paddingLeft: 20,
      flex: 1,
    },
    triggerTouchable: {
      style: {
        flex: 1,
      },
    },
  };

  const menuOptionsStyles = {
    optionsContainer: {
      width: 100,
      padding: 5,
    },
    optionWrapper: {
      margin: 5,
    },
  };

  const { computePosition } = renderers.ContextMenu;

  const CustomMenu = (props) => {
    const { style, children, layouts, ...other } = props;
    const position = computePosition(layouts);
    const { paddingTop } = getHeaderProps();
    position.top += paddingTop;
    return (
      <View {...other} style={[styles.customMenuStyles, style, position]}>
        {children}
      </View>
    );
  };

  const onMenuSelect = (value) => {
    if (value === 'adjustPoint') {
      setAdjustmentVisible(true);
    } else if (value === 'modifyUser') {
      setModifyUserVisible(true);
    }
  };

  const onAdjustmentClose = () => {
    setAdjustmentVisible(false);
  };

  const onModifyUserClose = () => {
    setModifyUserVisible(false);
  };

  return (
    <React.Fragment>
      <Menu
        onSelect={onMenuSelect}
        renderer={CustomMenu}
      >
        <MenuTrigger customStyles={menuTriggerStyles}>
          <Icon
            name={'md-more'}
            type='ionicon'
            color={'#fff'}
          />
        </MenuTrigger>
        <MenuOptions customStyles={menuOptionsStyles} >
          <MenuOption value={'modifyUser'} text='修改資料' />
          <MenuOption value={'adjustPoint'} text='調整點數' />
        </MenuOptions>
      </Menu>
      <PointsHandler
        user={inUser}
        mode={'adjustment'}
        visible={adjustmentVisible}
        onClose={onAdjustmentClose}
        // onUpdate={load} // TODO
      />
      <ModifyUser
        user={inUser}
        isApproval={inUser.role === 'PendingApproval'}
        visible={modifyUserVisible}
        onClose={onModifyUserClose}
      />
    </React.Fragment>

  );
}

const styles = StyleSheet.create({
  customMenuStyles: {
    backgroundColor: 'white',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 20, // shadow for android
  },
});
