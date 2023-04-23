use anyhow::{anyhow, Result};
use async_trait::async_trait;
use futures::lock::Mutex;
use lazy_static::lazy_static;
use std::cell::Cell;
use std::collections::HashMap;
use std::sync::Arc;

lazy_static! {
    pub static ref MAIN_SERVICE_MANAGER: ServiceManager = ServiceManager::new();
}

#[async_trait]
pub trait EnableManagedService {
    async fn start(&self);
}

pub struct ServiceManager {}

impl ServiceManager {
    pub fn new() -> Self {
        //TODO 后续根据配置文件
        ServiceManager {}
    }

    pub async fn launch(&self) -> Result<()> {
        tracing::info!("ServiceManager启动...");
        //根据配置启动服务
        super::ipfs::IpfsService {}.start().await;

        Ok(())
    }
}
