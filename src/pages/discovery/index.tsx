
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Button, Divider, Empty, RadioChangeEvent } from 'antd';
import { datasetRowsSearchByModelId } from '@/tauri/idns/index';
import { Input, Radio, Card, Typography, Tabs, Skeleton, Pagination, Spin } from 'antd';
import { ipfsStringContentByCid } from '@/tauri/idns/index';
// import { ActivityContentItem, ActivityDefaultViewer } from '@/components/activity/viewer/default-viewer';

const { Title, Paragraph } = Typography;

import HPG_PNG from '@/assets/hbg.png';

const { Search } = Input;

import styles from './index.less';

const MODEL_ID_MAP: { [key: string]: string } = {
    'activity': 'b797fb561b9243aeba5cde4b763d501a'
};

export default function DiscoveryPage() {

    const [active, setActive] = useState<'activity' | 'image' | 'chat' | 'course'>('activity');

    const [loading, setLoading] = useState<boolean>(false);

    const [items, setItems] = useState<Array<any>>([]);

    const [page, setPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(5);

    const [total, setTotal] = useState<number>(0);

    const [current, setCurrent] = useState<number>(0);

    const [mode, setMode] = useState<'list' | 'single'>('list');

    const [keywords, setKeywords] = useState<string>('');


    const refresh = (active: 'activity' | 'image' | 'chat' | 'course', pageSize: number, page: number, keywords: string) => {
        setLoading(true);
        let modelId = MODEL_ID_MAP[active];
        //
        datasetRowsSearchByModelId(modelId, pageSize, page, keywords).then((res) => {
            console.log(res);
            setItems(res.data);
            setPage(res.page);
            setPageSize(res.page_size);
            setTotal(res.total);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        //
        refresh(active, pageSize, page, keywords);
    }, [active]);

    return (
        <div className={classnames(styles.container)}>
            <div data-tauri-drag-region className={classnames(styles.header)}>
                <div data-tauri-drag-region className={classnames(styles.left)}>

                </div>
                <div data-tauri-drag-region className={classnames(styles.center)}>
                    <Radio.Group
                        options={[
                            { label: '活动', value: 'activity' },
                            { label: '素材', value: 'image' },
                            { label: '问答', value: 'chat' },
                            { label: '课程', value: 'course', disabled: true },
                        ]}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            setActive(value);
                        }}
                        value={active}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div data-tauri-drag-region className={classnames(styles.right)}>

                </div>
            </div>
            <div className={classnames(styles.content)}>
                {
                    mode === 'list' && (
                        <div className={classnames(styles.search_container, styles.search)}>
                            <img src={HPG_PNG}></img>
                            <div className={classnames(styles.search_form)}>
                                <Search value={keywords}
                                    loading={loading}
                                    allowClear={true}
                                    onChange={(event) => {
                                        setKeywords(event.target.value);
                                    }} onSearch={(key: string) => {
                                        refresh(active, pageSize, page, key);
                                    }} onPressEnter={(event) => {
                                        refresh(active, pageSize, page, keywords);
                                    }}></Search>
                            </div>
                        </div>
                    )
                }
                {
                    mode === 'single' && (
                        <div>
                            <Button type={'link'} onClick={() => {
                                setMode('list');
                            }}>返回</Button>
                        </div>
                    )
                }
                <div className={classnames(styles.grid)}>
                    {
                        loading ? (
                            <div className={classnames(styles.loading)}>
                                <Spin></Spin>
                            </div>
                        ) : (
                            mode === 'list' ? (
                                <div className={classnames(styles.center)}>
                                    <Grid items={items}
                                        category={active}
                                        setMode={setMode}
                                        setCurrent={setCurrent}></Grid>
                                    <Divider></Divider>
                                    <Pagination
                                        total={total}
                                        current={page}
                                        pageSize={pageSize}
                                        pageSizeOptions={[5, 10, 20, 50]}
                                        onChange={(newPage, nePpageSize) => {
                                            console.log(newPage, nePpageSize);
                                            refresh(active, nePpageSize, newPage, keywords);
                                        }}
                                        onShowSizeChange={(current, size) => {
                                            setPageSize(size);
                                        }} />
                                </div>
                            ) : (
                                <div className={classnames(styles.center)}>
                                    <ContentPanel item={items[current]}></ContentPanel>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
}


export interface GridProps {
    className?: string;
    items: Array<{ dataset_id: string; parts: string; row_cid: string }>;
    category: string;
    setMode: (mode: 'list' | 'single') => void;
    setCurrent: (current: number) => void;
}

const Grid: React.FC<GridProps> = ({ className, items, category, setMode, setCurrent }) => {

    if (!items || items.length <= 0) {
        return (
            <div className={classnames(styles.grid_container, className)}>
                <Empty description={'没有检索到数据'}></Empty>
            </div>
        );
    }

    return (
        <div className={classnames(styles.grid_container, className)}>
            {
                items && items.map((item, index) => {
                    return (
                        <GridItem key={index}
                            item={item}
                            className={classnames(styles.grid_item)}
                            category={category}
                            onClick={async () => {
                                setMode('single');
                                setCurrent(index);
                            }}
                        ></GridItem>
                    );
                })
            }
        </div>
    );
};

export interface GridItemProps {
    className?: string;
    item: { dataset_id: string; parts: string; row_cid: string };
    category: string;
    onClick: () => Promise<any>;
}

const GridItem: React.FC<GridItemProps> = ({ className, item, category, onClick }) => {
    const parts = item.parts.split(',').filter(str => str && str.length > 0);

    if (parts.length < 1) {
        return (<></>);
    }

    return (
        <div className={classnames(styles.grid_item, className)}>
            <Title level={5}>
                <span color={'red'}>[{parts[1]}]</span>
                <Button type={'link'} onClick={onClick}>{parts[0]}</Button>
            </Title>
            <ContentLazyPanel item={item}></ContentLazyPanel>
        </div>
    );
};


export interface ContentLazyPanelProps {
    className?: string;
    item: { dataset_id: string; parts: string; row_cid: string };
}

const ContentLazyPanel: React.FC<ContentLazyPanelProps> = ({ className, item }) => {

    const { dataset_id, row_cid } = item;

    const [loading, setLoading] = useState<boolean>(false);

    const [contentItem, setContentItem] = useState<any>();

    useEffect(() => {
        setLoading(true);
        ipfsStringContentByCid(row_cid, "content.json").then((content: string) => {
            let obj = JSON.parse(content);
            setContentItem(obj);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        });
    }, [row_cid]);

    return (
        <div className={classnames(styles.lazy_container, className)}>
            {
                loading ? (
                    <Skeleton></Skeleton>
                ) : (
                    <>
                        <Paragraph>{contentItem?.activityTitle}</Paragraph>
                        {
                            contentItem?.activityGoal 
                        }
                    </>
                )
            }
        </div>
    );
};

export interface ContentPanelProps {
    className?: string;
    item: { dataset_id: string; parts: string; row_cid: string };
}

const ContentPanel: React.FC<ContentPanelProps> = ({ className, item }) => {

    const { dataset_id, row_cid } = item;

    const [loading, setLoading] = useState<boolean>(false);

    const [contentItem, setContentItem] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        ipfsStringContentByCid(row_cid, "content.json").then((content: string) => {
            setContentItem(content);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, [row_cid]);

    return (
        <></>
    );
};
