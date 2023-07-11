


采样方法：采样算法。 这会极大地影响生成图像的内容和整体外观。 方法之间的执行时间和结果可能有很大差异。 最好先试验这个选项。
采样步数：图像生成过程中的去噪步数。 一些结果会随着步数的增加而发生巨大变化，而另一些结果会很快导致收益递减。 20-50 的值对于大多数采样器来说是理想的。
宽度、高度：输出图像尺寸。 对于 SD 2.0，768x768 是首选分辨率。 分辨率会影响生成的内容。
CFG 量表：无分类器指导 (CFG) 量表。 增加它会增加提示对图像的影响程度。 较低的值会产生更具创意的结果。
去噪强度：确定允许原始图像的变化量。 值为 0.0 时不会发生任何变化。 值为 1.0 时会完全忽略原始图像。 从 0.4–0.6 之间的值开始通常是一个安全的选择。
种子：随机种子值。 当你想比较变化尽可能小的设置的效果时很有用。 如果喜欢特定的一代但想对其进行一些修改，请复制种子。



https://supagruen.github.io/StableDiffusion-CheatSheet/




## stable diffusion 提示词

### 自然语法

### 标签语法/Tag

```
masterpiece, best quality, 1dog, 1cat, sun, grass
```

### emoji

参考 https://unicode.org/emoji/charts/emoji-list.html


### 颜文字

除了基本语法外，我们还可以使用一些语法来调节每个提示词的权重。调节权重包含以下几种方式：

* 默认情况下越靠前的提示词权重越高
* 通过 (提示词:权重数值) 手动设置权重，比如： (1cat:1.3),(1dog:0.8)
* 通过 () {} [] 设置权重：
* {提示词} 等价于 (提示词:1.05)
* (提示词) 等价于 (提示词:1.1)
* [提示词] 等价于 (提示词:0.952) 即 1/1.05
* 且 () {} [] 语法可嵌套使用，比如 (((提示词))) 就等价于 (提示词:1.331)。

一般情况下建议使用 (提示词:权重数值) 语法，可读性、可控性更高。

> 注意一般情况下权重不建议超过 1.5，不然会对画面造成巨大影响。

### OR

OR 语法一般用于提示词的混合，比如在绘制头发时通过 [purple|sliver|green]_hair 可以绘制出这样的混色的发色：

也可以使用 [horse|bird] 来生成长翅膀的马，不过细节很难控制：

### AND

比如 purple hair AND sliver hair AND green hair 可以生成这样的发色：

此外 AND 语法还支持为某个片段增加权重，比如 gold hair :1.2 AND sliver hair :0.8 AND green hair 可以让发色更多金色：

使用 bird AND lion AND horse 可以生成：


### 步骤控制语法

Stable Diffusion 还支持通过步骤控制语法来让某些元素从第几步开始绘制，到第几步结束。

比如 [cat:10] 指从第十步开始画猫，而 [cat::20] 表示在第二十步结束画猫。也可以组合使用，比如： [[cat::20]:10] 代表从第十步开始第二十步结束。

### 关键字占比控制

此外还有通过占比语法控制关键字的绘制占比的。

比如 [dog:girl:0.9] 表示总绘制步骤的前 90% 画狗，后面画女孩，而 [dog:girl:30] 则表示前三十步画狗，后面画女孩。

### 提升画面质量的提示词

HDR, HD，UHD, 64K (HDR、UHD、4K、8K和64K)

表示图片效果，带来的改变可以试试，不过也会影响渲染出图的时间，会根据你要求的画面质量延长时间。

Highly detailed 增加很多的细节，有时候描述没有那么多，随手丢进去，它会补细节。

Studio lighting 添加和谐的靠谱一些的灯光效果，小概率加一些纹理

Professional 会帮助自动调节对比度，色彩的和谐程度

Vivid Colors 会帮忙增加一些鲜艳的颜色，比如用画中国画高级的配色，希望用到景泰蓝，经常会出现有点雾蒙蒙的，加入后会增强颜色的纯度和饱和度。

Bokeh 画人像可以多尝试用这个词语，会比较突出人像

high quality 高品质

masterpiece 杰出

best quality 最好品质

photography 摄影作品

ultra highres 超高分辨率

RAW photo 原始照片

ultra-detailed

finely detail

highres

8k wallpaper

```
(8k, best quality, masterpiece, ultra highres:1.2) Photo of Pretty Japanese woman in the (style of paul rubens and rebecca guay:1.1) (melancholy winter snow:1.4)

```

### 常用的反向提示词

worst quality

bad quality

low quality

normal quality

lowres

normal quality

示例可以见1上的反向提示词。




https://github.com/mxinden/rust-libp2p-server


```
{
  "enable_hr": false,
  "denoising_strength": 0,
  "prompt": "<lora:Chinese style_20230608163116:1>",
  "seed": 3664758608,
  "batch_size": 1,
  "n_iter": 1,
  "steps": 20,
  "cfg_scale": 7,
  "width": 512,
  "height": 512,
  "restore_faces": false,
  "tiling": false,
  "negative_prompt": "",
  "override_settings": {
      "sd_model_checkpoint" :"glove_2d_v1.0.safetensors [5a7c8c091d]"
   },
  "script_args": [
   ],
  "sampler_index": "Euler a"
}
```