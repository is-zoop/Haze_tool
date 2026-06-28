---
id: xq_shop_sales
title: 小强店铺业绩数据
description: 查询小强店铺、项目、平台维度的销售额、收入、利润、成本、费用和退货率相关指标。
keywords: [小强, 店铺, 项目, 销售, 收入, 利润, 费用, 退货率, GMV]
required_params:
  - name: start_date_pt
    type: string
    description: 开始账期，格式 YYYYMMDD，例如 20260601。
  - name: end_date_pt
    type: string
    description: 结束账期，格式 YYYYMMDD，例如 20260630。
optional_params:
  - name: shop_project
    type: string
    default: null
    description: 可选项目名称过滤。
  - name: shop_plat_type
    type: string
    default: null
    description: 可选平台名称过滤。
  - name: shop_fin_name
    type: string
    default: null
    description: 可选店铺名称过滤。
dimensions:
  - id: stat_date
    label: 统计日期
    column: stat_date
  - id: shop_project
    label: 项目名称
    column: shop_project
  - id: shop_plat_type
    label: 平台
    column: shop_plat_type
  - id: shop_fin_name
    label: 店铺名称
    column: shop_fin_name
measures:
  - id: gmv_excluding_internal
    label: GMV去内购
    column: gmv_excluding_internal
    default_aggregation: sum
  - id: revenue
    label: 收入
    column: revenue
    default_aggregation: sum
  - id: profit
    label: 利润
    column: profit
    default_aggregation: sum
  - id: goods_cost
    label: 商品成本
    column: goods_cost
    default_aggregation: sum
  - id: sales_cost
    label: 销售费用
    column: sales_cost
    default_aggregation: sum
  - id: manage_cost
    label: 管理费用
    column: manage_cost
    default_aggregation: sum
  - id: ad_cost
    label: 推广费用
    column: ad_cost
    default_aggregation: sum
  - id: actual_return_numerator
    label: 实际退货率分子
    column: actual_return_numerator
    default_aggregation: sum
  - id: actual_return_denominator
    label: 实际退货率分母
    column: actual_return_denominator
    default_aggregation: sum
  - id: before_return_numerator
    label: 发货前退货率分子
    column: before_return_numerator
    default_aggregation: sum
  - id: before_return_denominator
    label: 发货前退货率分母
    column: before_return_denominator
    default_aggregation: sum
  - id: after_return_numerator
    label: 发货后退货率分子
    column: after_return_numerator
    default_aggregation: sum
  - id: after_return_denominator
    label: 发货后退货率分母
    column: after_return_denominator
    default_aggregation: sum
  - id: after_delivery_amount
    label: 实发销售额
    column: after_delivery_amount
    default_aggregation: sum
aggregations: [sum, avg, count, min, max]
derived_metrics:
  - id: profit_rate
    label: 利润率
    formula: profit_sum / revenue_sum
    description: 聚合利润 / 聚合收入。
  - id: pricing_multiplier
    label: 定价倍率
    formula: revenue_sum / goods_cost_sum
    description: 聚合收入 / 聚合商品成本。
  - id: sales_cost_rate
    label: 销售费率
    formula: sales_cost_sum / revenue_sum
    description: 聚合销售费用 / 聚合收入。
  - id: manage_cost_rate
    label: 管理费率
    formula: manage_cost_sum / revenue_sum
    description: 聚合管理费用 / 聚合收入。
  - id: ad_cost_rate
    label: 推广费率
    formula: ad_cost_sum / revenue_sum
    description: 聚合推广费用 / 聚合收入。
  - id: actual_return_rate
    label: 实际退货率
    formula: actual_return_numerator_sum / actual_return_denominator_sum
    description: 实际退货率分子 / 实际退货率分母。
  - id: before_delivery_return_rate
    label: 发货前退货率
    formula: before_return_numerator_sum / before_return_denominator_sum
    description: 发货前退货率分子 / 发货前退货率分母。
  - id: after_delivery_return_rate
    label: 发货后退货率
    formula: after_return_numerator_sum / after_return_denominator_sum
    description: 发货后退货率分子 / 发货后退货率分母。
  - id: shipped_return_rate
    label: 实发退货率
    formula: after_return_numerator_sum / after_delivery_amount_sum
    description: 发货后退货率分子 / 实发销售额。
output_fields:
  stat_date: 统计日期
  shop_project: 项目名称
  shop_plat_type: 平台
  shop_fin_name: 店铺名称
  gmv_excluding_internal: GMV去内购
  revenue: 收入
  profit: 利润
  goods_cost: 商品成本
  sales_cost: 销售费用
  manage_cost: 管理费用
  ad_cost: 推广费用
  actual_return_numerator: 实际退货率分子
  actual_return_denominator: 实际退货率分母
  before_return_numerator: 发货前退货率分子
  before_return_denominator: 发货前退货率分母
  after_return_numerator: 发货后退货率分子
  after_return_denominator: 发货后退货率分母
  after_delivery_amount: 实发销售额
  gmv_excluding_internal_sum: GMV去内购合计
  revenue_sum: 收入合计
  profit_sum: 利润合计
  goods_cost_sum: 商品成本合计
  sales_cost_sum: 销售费用合计
  manage_cost_sum: 管理费用合计
  ad_cost_sum: 推广费用合计
  actual_return_numerator_sum: 实际退货率分子合计
  actual_return_denominator_sum: 实际退货率分母合计
  before_return_numerator_sum: 发货前退货率分子合计
  before_return_denominator_sum: 发货前退货率分母合计
  after_return_numerator_sum: 发货后退货率分子合计
  after_return_denominator_sum: 发货后退货率分母合计
  after_delivery_amount_sum: 实发销售额合计
  profit_rate: 利润率
  pricing_multiplier: 定价倍率
  sales_cost_rate: 销售费率
  manage_cost_rate: 管理费率
  ad_cost_rate: 推广费率
  actual_return_rate: 实际退货率
  before_delivery_return_rate: 发货前退货率
  after_delivery_return_rate: 发货后退货率
  shipped_return_rate: 实发退货率
---

# 小强店铺业绩数据

当用户询问小强店铺、项目、平台维度的销售额、收入、利润、费用、成本、退货率等经营数据时，使用本主题。

## 输出字段名称

| 字段ID | 输出名称     | 是否展示 |
| --- |----------|------|
| stat_date | 统计日期     | 是    |
| shop_project | 项目名称     | 是    |
| shop_plat_type | 平台       | 是    |
| shop_fin_name | 店铺名称     | 是    |
| gmv_excluding_internal | GMV去内购   | 是    |
| revenue | 收入       | 是    |
| profit | 利润       | 是    |
| goods_cost | 商品成本     | 是    |
| sales_cost | 销售费用     | 是    |
| manage_cost | 管理费用     | 是    |
| ad_cost | 推广费用     | 是    |
| actual_return_numerator | 实际退货率分子  | 否    |
| actual_return_denominator | 实际退货率分母  | 否    |
| before_return_numerator | 发货前退货率分子 | 否    |
| before_return_denominator | 发货前退货率分母 | 否    |
| after_return_numerator | 发货后退货率分子 | 否    |
| after_return_denominator | 发货后退货率分母 | 否    |
| after_delivery_amount | 实发退货销售额  | 否    |
| profit_rate | 利润率      | 是    |
| pricing_multiplier | 定价倍率     | 是    |
| sales_cost_rate | 销售费率     | 是    |
| manage_cost_rate | 管理费率     | 是    |
| ad_cost_rate | 推广费率     | 是    |
| actual_return_rate | 实际退货率    | 是    |
| before_delivery_return_rate | 发货前退货率   | 是    |
| after_delivery_return_rate | 发货后退货率   | 是    | 
| shipped_return_rate | 实发退货率    | 是    |

## 参数说明

- `start_date_pt`：必填，开始账期，格式 `YYYYMMDD`。
- `end_date_pt`：必填，结束账期，格式 `YYYYMMDD`。
- `shop_project`：可选，项目名称。
- `shop_plat_type`：可选，平台名称。
- `shop_fin_name`：可选，店铺名称。

## 衍生指标口径

- 利润率 = 聚合利润 / 聚合收入
- 定价倍率 = 聚合收入 / 聚合商品成本
- 销售费率 = 聚合销售费用 / 聚合收入
- 管理费率 = 聚合管理费用 / 聚合收入
- 推广费率 = 聚合推广费用 / 聚合收入
- 实际退货率 = 实际退货率分子 / 实际退货率分母
- 发货前退货率 = 发货前退货率分子 / 发货前退货率分母
- 发货后退货率 = 发货后退货率分子 / 发货后退货率分母
- 实发退货率 = 发货后退货率分子 / 实发销售额

## SQL

SQL 输出别名必须与 front matter 中的 `dimensions.column` 和 `measures.column` 保持一致。

```sql
SELECT
  STR_TO_DATE(a.date_pt, '%%Y%%m%%d') AS stat_date,
  b.shop_project AS shop_project,
  b.shop_plat_type AS shop_plat_type,
  b.shop_fin_name AS shop_fin_name,
  a.sls_xq_gmv_rmv_insid AS gmv_excluding_internal,
  a.sls_xq_real_amount AS revenue,
  a.sls_xq_profit AS profit,
  a.sls_xq_goods_cost AS goods_cost,
  a.sls_xq_sls_cost AS sales_cost,
  a.sls_xq_manage_cost AS manage_cost,
  a.sls_xq_ad_cost AS ad_cost,
  a.sls_xq_practical_return_ratio1 AS actual_return_numerator,
  a.sls_xq_practical_return_ratio2 AS actual_return_denominator,
  a.sls_xq_before_delivery_return_ratio1 AS before_return_numerator,
  a.sls_xq_before_delivery_return_ratio2 AS before_return_denominator,
  a.sls_xq_after_delivery_return_ratio1 AS after_return_numerator,
  a.sls_xq_after_delivery_return_ratio2 AS after_return_denominator,
  a.sls_xq_after_delivery_amount AS after_delivery_amount
FROM dwh_maxcomputer.dwd_sls_xq_shop_data_formula a
INNER JOIN dwh_maxcomputer.dim_shop b
  ON a.sls_xq_cw_shop_info_id = b.shop_fin_id
  AND STR_TO_DATE(a.date_pt, '%%Y%%m%%d') >= DATE(b.shop_effect_date)
  AND STR_TO_DATE(a.date_pt, '%%Y%%m%%d') < DATE(COALESCE(b.shop_invalid_date, '9999-12-31'))
WHERE a.date_pt BETWEEN %(start_date_pt)s AND %(end_date_pt)s
  AND (%(shop_project)s IS NULL OR b.shop_project = %(shop_project)s)
  AND (%(shop_plat_type)s IS NULL OR b.shop_plat_type = %(shop_plat_type)s)
  AND (%(shop_fin_name)s IS NULL OR b.shop_fin_name = %(shop_fin_name)s)
```
