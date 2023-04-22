import { clearLocalValue, logout } from '@/utils';
import { Button, Divider } from 'antd';
import { history, useLocation } from 'umi';

export default {
    "home": [
        {
            "title": "软软"
        }
    ],
    "chat": [],
    "painter": [],
    "prompts": [],
    "settings": [
        // {
        //     "title": "账号设置",
        //     "path": "/settings/account"
        // },
        // {
        //     "title": "客服",
        //     "path": "/settings/customerservice"
        // },
        // {
        //     "title": "升级",
        //     "path": "/settings/upgrade"
        // },
        // {
        //     "title": "官网",
        //     "type": "URL",
        //     "path": "https://rrai.idns.link"
        // },
        {
            "type": "Divider",
        },
        {
            "type": "ReactNode",
            "node": (
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" danger style={{ minWidth: '180px' }} onClick={() => {
                        logout();
                        history.push('/login');
                    }}>退出登录</Button>
                </div>
            )
        },
    ]
} as { [key: string]: any }