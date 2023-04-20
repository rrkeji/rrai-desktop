use anyhow::{anyhow, Result};
use std::path::PathBuf;

pub fn rrai_home_path() -> Result<PathBuf> {
    let home_path = std::env::var_os("IDNS_RRAI_PATH")
        .map(PathBuf::from)
        .or_else(|| {
            home::home_dir().map(|tilde| {
                let mut path = PathBuf::from(tilde);
                path.push(".rrai");
                path
            })
        });
    //
    //
    if let Some(home_path) = home_path {
        //
        std::fs::create_dir_all(home_path.as_path())?;
        Ok(home_path)
    } else {
        Err(anyhow!("没有设置IDNS_RRAI_PATH路径"))
    }
}
