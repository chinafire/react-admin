import React from 'react';
import {Layout} from 'antd';
import {withRouter} from 'react-router-dom';
import routes from '../../router/config';
import SiderMenu from '../siderMenu';

const {Sider} = Layout;

class CustomSider extends React.Component {

    static getDerivedStateFromProps(props, state) {
        if (props.collapsed !== state.collapsed) {
            const state1 = CustomSider.setMenuOpen(props);
            const state2 = CustomSider.onCollapse(props.collapsed);
            return {
                ...state1,
                ...state2,
                firstHide: state.collapsed !== props.collapsed && props.collapsed,
                openKey: state.openKey || (!props.collapsed && state1.openKey)
            }
        }
        return null;
    }

    static setMenuOpen = props => {
        const {pathname} = props.location;
        return {
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        };
    };

    static onCollapse = (collapsed) => {
        return {
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        };
    };

    state = {
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        firstHide: true,
    };

    componentDidMount() {
        const state = CustomSider.setMenuOpen(this.props);
        this.setState(state);
    }

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        const {popoverHide} = this.props;
        popoverHide && popoverHide();
    };

    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };

    render() {
        const {selectedKey, openKey, firstHide, collapsed} = this.state;
        return (
            <Sider trigger={null} breakpoint="lg" collapsed={collapsed} style={{overflowY: 'auto'}}>
                <div className="logo"/>
                <SiderMenu
                    menus={routes.menus}
                    onClick={this.menuClick}
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}
                />
                <style>
                    {`#nprogress .spinner{
                        left: ${collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }`}
                </style>
            </Sider>
        )
    }
}

export default withRouter(CustomSider);
