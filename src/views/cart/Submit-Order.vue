<template>
    <div
        v-if="!loading"
        :class="$style.submitOrder"
    >
        <div
            :class="$style.address + ' radius-20'"
            v-if="physicalProducts.length > 0"
        >
            <AddressItem ref="addAddressItem" />
        </div>

        <!-- *************************实体************************* -->
        <div
            v-if="physicalProducts.length > 0"
            :class="$style.productBox"
        >
            <div :class="$style.orderItemBox">
                <OrderItem
                    v-for="(item, index) of physicalProducts"
                    :key="index"
                    :img="item.productImg"
                    :name="item.productName"
                    :count="item.count"
                    :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
                    :price="activeProduct === 5 ? item.originPrice : item.price"
                    :support-refund="item.supportRefund"
                    :gap="32"
                    :product-type="1"
                    :pre-active="preActivity"
                    :active-product="activeProduct"
                    :allow-invoice="item.showInvoice"
                    border
                />
            </div>
            <OtherInfo>
                <InfoItem>
                    <div slot="label">
                        <span>配送方式</span>
                        <span v-if="freight > 0" class="ml-10">普通快递</span>
                    </div>
                    <template slot="content">
                        <span v-if="freight === 0" :class="$style.itemContent">
                            快递免邮
                        </span>
                        <span v-if="freight > 0" :class="$style.freight">
                            ¥ {{ freight }}
                        </span>
                    </template>
                </InfoItem>

                <InfoItem v-if="isCart && activeProduct === 5 && detail.discount !== 10">
                    <template slot="label">春耘折扣</template>
                    <template slot="content">
                        {{ detail.discount }}折 -¥{{ (physicalProductOriginalPrice - physicalProductPrice).toFixed(2) }}
                    </template>
                </InfoItem>

                <InfoItem v-if="activeProduct === 6 && detail.discount !== 10">
                    <template slot="label">课程折扣</template>
                    <span slot="content">{{ detail.discount }}折 -¥{{ (physicalProductOriginalPrice - physicalProductPrice).toFixed(2) }}</span>
                </InfoItem>

                <InfoItem v-if="isCart">
                    <template slot="label">订单备注</template>
                    <template slot="content">
                        <input
                            :class="$style.remark"
                            type="text"
                            placeholder="选填"
                            v-model="physicalRemark"
                        >
                    </template>
                </InfoItem>

                <InfoItem v-if="!isCart">
                    <template slot="label">购买数量</template>
                    <template slot="content">
                        <div :class="$style.editCount">
                            <span>剩余{{ (activeProduct !== 1 && preActivity === 2) ? physicalProducts[0].activeStock : physicalProducts[0].stock }}件</span>
                            <Count
                                :min="physicalProducts[0].minBuyNum"
                                :max="(activeProduct !== 1 && preActivity === 2) ? (physicalProducts[0].activityLimit ? physicalProducts[0].activityLimitNumber : physicalProducts[0].activeStock) : (physicalProducts[0].purchaseQuantity || physicalProducts[0].stock)"
                                :count="physicalProducts[0].count"
                                @change="(count, next) => { countChange(count, physicalProducts[0], next) }"
                            />
                        </div>
                    </template>
                </InfoItem>

                <InfoItem>
                    <template slot="label">商品金额</template>
                    <span slot="content" class="gray-1">¥ {{ physicalAmount }}</span>
                </InfoItem>

                <InfoItem v-if="(coupon.amount || isNotChooseCoupon) && !isCart && activeProduct === 1" @click="showCoupon = true">
                    <template slot="label">优惠券</template>
                    <span slot="content">
                        <span v-if="!isNotChooseCoupon">-¥{{ coupon.amount }}</span>
                        <span v-else>{{ couponList.length }}张可用</span>
                        <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                    </span>
                </InfoItem>

                <InfoItem
                    v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && !isCart && activeProduct === 1"
                    @click="showRedEnvelopePopupClick"
                >
                    <template slot="label">奖学金（红包）</template>
                    <span slot="content">
                        <span v-if="!isNotChooseRedEnvelope">-¥{{ currentRedEnvelope.amount }}</span>
                        <span v-else-if="redEnvelopeList.length">有可用</span>
                        <span v-else>无可用</span>
                        <pl-svg class="ml-10" name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" />
                    </span>
                </InfoItem>
            </OtherInfo>
        </div>

        <CustomBlock
            v-if="isCart && physicalProducts.some(item => item.needStudentInfo === 2)"
            :products="physicalProducts"
            label="用户信息"
        />

        <!-- *************************虚拟************************* -->
        <template v-if="virtualProducts.length > 0">
            <div
                v-for="(item, index) of virtualProducts"
                :key="item.skuCode1"
                :class="$style.productBox"
            >
                <div :class="$style.orderItemBox">
                    <OrderItem
                        :key="index"
                        :img="item.productImg"
                        :name="item.productName"
                        :count="item.count"
                        :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
                        :price="activeProduct === 5 ? item.originPrice : item.price"
                        :support-refund="item.supportRefund"
                        is-submit
                        :gap="32"
                        :product-type="2"
                        :active-product="activeProduct"
                        :allow-invoice="item.showInvoice"
                        :pre-active="preActivity"
                        border
                    />
                </div>
                <OtherInfo>
                    <InfoItem>
                        <template slot="label">使用时间</template>
                        <p slot="content" class="fz-24" v-if="item.validityPeriodStart">
                            <span>
                                {{ item.validityPeriodStart | dateFormat('YYYY.MM.DD') }}
                            </span>
                            <template v-if="item.validityPeriodStart.split(' ')[0] !== item.validityPeriodEnd.split(' ')[0]">
                                -
                                <span>
                                    {{ item.validityPeriodEnd | dateFormat('YYYY.MM.DD') }}
                                </span>
                            </template>
                        </p>
                        <p slot="content" v-else class="fz-24">
                            长期有效
                        </p>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 5 && detail.discount !== 10">
                        <template slot="label">春耘折扣</template>
                        <span slot="content" :class="$style.itemContent">{{ detail.discount }}折 -¥{{ (item.originPrice - item.price) * item.count }}</span>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 6 && detail.discount !== 10">
                        <template slot="label">课程折扣</template>
                        <span slot="content">{{ detail.discount }}折 -¥{{ ((item.originPrice - item.price) * item.count).toFixed(2) }}</span>
                    </InfoItem>

                    <StudentInline
                        v-if="isCart && item.needStudentInfo === 1"
                        :product="item"
                        :count="item.count"
                        :lesson-error-id="lessonErrorId"
                        :lesson-error-tip="lessonErrorTip"
                        :students="CHECKED_STUDENT[item.skuCode1 + item.skuCode2] || []"
                        :custom-list="item.formEntityList"
                    />

                    <CustomInline
                        v-if="isCart && item.needStudentInfo === 2"
                        :product="item"
                        :key="item.productId"
                        :count="item.count"
                        :custom-list="item.formEntityList"
                        :error-item-id="customErrorId"
                    />

                    <InfoItem v-if="isCart">
                        <template slot="label" :class="$style.itemLabel">订单备注</template>
                        <input
                            slot="content"
                            :class="$style.remark"
                            type="text"
                            placeholder="选填"
                            v-model="item.remark"
                        >
                    </InfoItem>

                    <InfoItem v-if="!isCart">
                        <template slot="label" :class="$style.itemLabel">购买数量</template>
                        <template slot="label">购买数量</template>
                        <div :class="$style.editCount" slot="content">
                            <span>剩余{{ (activeProduct !== 1 && preActivity === 2) ? item.activeStock : item.stock }}件</span>
                            <Count
                                :min="item.minBuyNum"
                                :max="(activeProduct !== 1 && preActivity === 2) ? (item.activityLimit ? item.activityLimitNumber : item.activeStock) : (item.purchaseQuantity || item.stock)"
                                :count="item.count"
                                @change="(count, next) => { countChange(count, item, next) }"
                            />
                        </div>
                    </InfoItem>

                    <InfoItem>
                        <template slot="label">商品金额</template>
                        <span slot="content" class="gray-1">¥ {{ item.amount }}</span>
                    </InfoItem>

                    <InfoItem v-if="(coupon.amount || isNotChooseCoupon) && !isCart && activeProduct === 1">
                        <template slot="label">优惠券</template>
                        <div slot="content">
                            <span v-if="!isNotChooseCoupon">-¥{{ coupon.amount }}</span>
                            <span v-else>{{ couponList.length }}张可用</span>
                            <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                        </div>
                    </InfoItem>

                    <InfoItem
                        v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && !isCart && activeProduct === 1"
                        @click="showRedEnvelopePopupClick"
                    >
                        <template slot="label">奖学金（红包）</template>
                        <div slot="content">
                            <span v-if="!isNotChooseRedEnvelope">-¥{{ currentRedEnvelope.amount }}</span>
                            <span v-else-if="redEnvelopeList.length">有可用</span>
                            <span v-else>无可用</span>
                            <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                        </div>
                    </InfoItem>
                </OtherInfo>
            </div>
        </template>

        <!-- *************************课程************************* -->
        <template v-if="lessonList.length > 0">
            <div
                v-for="(item, index) of lessonList"
                :key="index"
                :class="$style.productBox"
            >
                <div :class="$style.orderItemBox">
                    <OrderItem
                        :key="index"
                        :img="item.productImg"
                        :name="item.productName"
                        :count="item.count"
                        :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
                        :price="activeProduct === 5 ? item.originPrice : item.price"
                        :support-refund="item.supportRefund"
                        is-submit
                        :gap="32"
                        :product-type="2"
                        :active-product="activeProduct"
                        :pre-active="preActivity"
                        :allow-invoice="item.showInvoice"
                        border
                    />
                </div>
                <OtherInfo>
                    <InfoItem>
                        <template slot="label">
                            使用时间
                        </template>
                        <template slot="content">
                            <p v-if="item.validityPeriodStart">
                                <span>
                                    {{ item.validityPeriodStart | dateFormat('YYYY.MM.DD') }}
                                </span>
                                <template v-if="item.validityPeriodStart.split(' ')[0] !== item.validityPeriodEnd.split(' ')[0]">
                                    -
                                    <span>
                                        {{ item.validityPeriodEnd | dateFormat('YYYY.MM.DD') }}
                                    </span>
                                </template>
                            </p>
                            <p v-else class="fz-24">
                                长期有效
                            </p>
                        </template>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 5 && detail.discount !== 10">
                        <template slot="label">春耘折扣</template>
                        <span slot="content">{{ detail.discount }}折 -¥{{ ((item.originPrice - item.price) * item.count).toFixed(2) }}</span>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 6 && detail.discount !== 10">
                        <template slot="label">课程折扣</template>
                        <span slot="content">{{ detail.discount }}折 -¥{{ ((item.originPrice - item.price) * item.count).toFixed(2) }}</span>
                    </InfoItem>

                    <StudentInline
                        v-if="isCart && item.needStudentInfo === 1"
                        :product="item"
                        :count="item.count"
                        :lesson-error-id="lessonErrorId"
                        :lesson-error-tip="lessonErrorTip"
                        :students="CHECKED_STUDENT[item.skuCode1 + item.skuCode2] || []"
                        :custom-list="item.formEntityList"
                    />

                    <CustomInline
                        :key="item.productId"
                        v-if="isCart && item.needStudentInfo === 2"
                        :product="item"
                        :count="item.count"
                        :custom-list="item.formEntityList"
                        :error-item-id="customErrorId"
                    />

                    <InfoItem v-if="isCart">
                        <template slot="label">订单备注</template>
                        <input
                            slot="content"
                            :class="$style.remark"
                            type="text"
                            placeholder="选填"
                            v-model="item.remark"
                        >
                    </InfoItem>

                    <InfoItem v-if="!isCart">
                        <template slot="label">购买数量</template>
                        <div :class="$style.editCount" slot="content">
                            <span>剩余{{ (activeProduct !== 1 && preActivity === 2) ? item.activeStock : item.stock }}件</span>
                            <Count
                                :min="item.minBuyNum"
                                :max="(activeProduct !== 1 && preActivity === 2) ? (item.activityLimit ? item.activityLimitNumber : item.activeStock) : (item.purchaseQuantity || item.stock)"
                                :count="item.count"
                                @change="(count, next) => { countChange(count, item, next) }"
                            />
                        </div>
                    </InfoItem>

                    <InfoItem>
                        <template slot="label">商品金额</template>
                        <span slot="content" class="gray-1">¥ {{ item.amount }}</span>
                    </InfoItem>

                    <InfoItem v-if="(coupon.amount || isNotChooseCoupon) && !isCart && activeProduct === 1">
                        <template slot="label">优惠券</template>
                        <div slot="content">
                            <span v-if="!isNotChooseCoupon">-¥{{ coupon.amount }}</span>
                            <span v-else>{{ couponList.length }}张可用</span>
                            <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                        </div>
                    </InfoItem>

                    <InfoItem v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && !isCart && activeProduct === 1">
                        <template slot="label">奖学金（红包）</template>
                        <div slot="content">
                            <span v-if="!isNotChooseRedEnvelope">-¥{{ currentRedEnvelope.amount }}</span>
                            <span v-else-if="redEnvelopeList.length">有可用</span>
                            <span v-else>无可用</span>
                            <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                        </div>
                    </InfoItem>
                </OtherInfo>
            </div>
        </template>

        <div :class="$style.confirm">
            <div>
                <span class="fz-20 gray-2">合计</span>
                <span
                    class="rmb fz-32"
                    v-text="totalAmount || 0"
                />
            </div>
            <pl-button
                style="width: 28vw;"
                :loading="submiting"
                type="warning"
                size="large"
                @click="submitOrder"
            >
                确认付款
            </pl-button>
        </div>

        <div
            v-if="(coupon.amount || isNotChooseCoupon) && isCart && activeProduct === 1"
            :class="$style.itemSelector"
            @click.capture="showCoupon = true"
        >
            <pl-fields
                size="middle"
                text="优惠"
                icon="icon-coupon"
                :icon-gap="12"
                show-right-icon
                :right-text="isNotChooseCoupon ? couponList.length +'张可用' : '-¥' + coupon.amount "
                left-text-weight="bold"
            />
        </div>

        <div
            v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && isCart && activeProduct === 1"
            :class="$style.itemSelector"
            @click.capture="showRedEnvelopePopupClick"
        >
            <pl-fields
                size="middle"
                text="奖学金（红包）"
                icon="icon-RedEnvelope"
                :icon-gap="12"
                show-right-icon
                :right-text="isNotChooseRedEnvelope ? '有可用' : '-¥' + currentRedEnvelope.amount"
                left-text-weight="bold"
            />
        </div>

        <div
            v-if="totalAmount > 0 && showInvoiceSelector && activeProduct === 1"
            :class="$style.itemSelector" @click.capture="selectInvoice"
        >
            <pl-fields
                size="middle"
                text="发票"
                icon="icon-invoice"
                :icon-gap="12"
                show-right-icon
                :right-text="invioceType === 0 ? '不需要' : '纸质发票'"
                left-text-weight="bold"
            />
        </div>

        <div
            v-if="needStudentList.length === 1 && !isCart"
            :class="$style.itemSelector"
            @click.capture="selectStudent(needStudentList[0])"
        >
            <pl-fields
                size="middle"
                text="学员信息"
                icon="icon-name-card"
                :icon-gap="12"
                :right-text="`已选${getStudentCountByProId(needStudentList[0].skuCode1 + needStudentList[0].skuCode2)}人`"
                show-right-icon
                left-text-weight="bold"
            >
                <ul :class="$style.studentList" v-show="CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2] && CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2].length > 0">
                    <li :class="$style.studentItem" v-for="(item, i) of CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2]" :key="i">
                        <p :class="$style.studentName">
                            <span>姓名</span>
                            <span v-text="item.stuName" />
                        </p>
                        <p :class="$style.studentPhone">
                            <span>电话</span>
                            <span v-text="item.stuMobile" />
                        </p>
                    </li>
                </ul>
            </pl-fields>
        </div>

        <CustomBlock
            v-if="customList.length === 1 && !isCart"
            :product="customList[0]"
            :count="customList[0].count"
            :custom-list="customList[0].formEntityList"
            :label="physicalProducts.length ? '用户信息' : '学员信息'"
        />

        <div v-if="physicalProducts.length === 0" :class="$style.itemSelector" @click.capture="chooseContact">
            <pl-fields
                size="middle"
                text="联系人信息"
                icon="icon-contact"
                :icon-gap="12"
                :right-text="contactInfoModel.name && contactInfoModel.mobile ? '已选择' : `未选择`"
                show-right-icon
                left-text-weight="bold"
            >
                <div v-show="contactInfoModel.name && contactInfoModel.mobile" :class="$style.contactDetail">
                    <span class="fz-28" v-text="contactInfoModel.name" />
                    <span class="fz-28" v-text="contactInfoModel.mobile" />
                </div>
            </pl-fields>
        </div>

        <!-- 订单备注（只有一个商品时显示） -->
        <div :class="$style.oneProductMark" v-if="!isCart">
            <span>订单备注</span>
            <input type="text" placeholder="请和商家协商一致后填写" v-model="remark">
        </div>

        <pl-popup :show.sync="showPopup">
            <div :class="$style.invioceBox">
                <div :class="$style.title">
                    是否需要发票？
                </div>
                <div :class="$style.content">
                    <button @click="noNeed">
                        不需要
                    </button>
                    <button @click="need">
                        纸质发票
                    </button>
                </div>
            </div>
        </pl-popup>

        <pl-popup
            :show.sync="showContactPopup"
            :close-on-click-modal="false"
            @close="contactInfoForm.name = ''; contactInfoForm.mobile = '';"
        >
            <div :class="$style.addContact">
                <div :class="$style.addContactTop">
                    联系人信息
                </div>
                <pl-form :model="contactInfoForm" :rules="rules" ref="contactForm">
                    <pl-form-item prop="name" label="姓名：" :label-width="204" :gap-top="20">
                        <pl-input v-model="contactInfoForm.name" />
                    </pl-form-item>
                    <pl-form-item prop="mobile" label="手机号码：" :label-width="204" :gap-top="20">
                        <pl-input v-model="contactInfoForm.mobile" />
                    </pl-form-item>
                </pl-form>
                <pl-button size="huge" type="warning" @click="useContact">
                    使用
                </pl-button>
            </div>
        </pl-popup>

        <!-- 优惠券弹框 -->
        <pl-popup
            :show.sync="showCoupon"
            title="领取优惠券"
            title-align="left"
        >
            <div :class="$style.coupon">
                <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
                <div :class="$style.couponList">
                    <template v-for="(item, i) of couponList">
                        <div :key="i" :class="$style.couponItem" @click="couponClick(item)">
                            <div :class="$style.button">省{{ item.amount }}</div>
                            <div :class="$style.full">满{{ item.useLimitAmount }}减{{ item.amount }}</div>
                            <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                            <span :class="$style.recommend" v-if="recommendCouponId === item.id">推荐使用</span>
                            <span :class="$style.choices">
                                <pl-svg v-if="item.id === coupon.id" name="icon-xuanzhong" width="40" />
                                <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                            </span>
                        </div>
                    </template>
                    <div :class="$style.couponItem" @click="couponClick({}, true)">
                        <div :class="$style.notChooseCoupon">不参加优惠</div>
                        <span :class="$style.choices">
                            <pl-svg v-if="isNotChooseCoupon" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>

        <!-- 红包弹框 -->
        <pl-popup
            :show.sync="showRedEnvelopePopup"
            title="奖学金（红包）"
            title-align="left"
        >
            <div :class="$style.redEnvelope">
                <p class="fz-28 gray-3">仅支持选择一个奖学金进行抵扣</p>
                <div :class="$style.redEnvelopeList">
                    <template v-for="(item, i) of redEnvelopeList">
                        <div :key="i" :class="$style.redEnvelopeItem" @click="redEnvelopeClick(item, false)">
                            <span>
                                <pl-svg name="icon-RedEnvelope" width="40" />
                            </span>
                            <span :class="$style.count">￥{{ item.amount }}</span>
                            <span v-if="item.amount > (totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0))" :class="$style.isOver">使用后超出抵用金额不返还</span>
                            <span :class="$style.choices">
                                <pl-svg v-if="item.id === currentRedEnvelope.id" name="icon-xuanzhong" width="40" />
                                <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                            </span>
                        </div>
                    </template>
                    <div :class="$style.redEnvelopeItem" @click="redEnvelopeClick({}, true)">
                        <span :class="$style.notChooseRedEnvelope">不使用</span>
                        <span :class="$style.choices">
                            <pl-svg v-if="isNotChooseRedEnvelope" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>
    </div>

    <div
        :class="$style.skeleton"
        v-else
    >
        <div :class="$style.skeleton1">
            <AddressItemSkeleton />
        </div>
        <div :class="$style.skeleton2">
            <div :class="$style.skeleton21 + ' ' + $style.skeAnimation" />
            <OrderItemSkeleton />
            <div :class="$style.skeleton22 + ' ' + $style.skeAnimation" />
            <div :class="$style.skeleton23 + ' ' + $style.skeAnimation" />
            <div :class="$style.skeleton24 + ' ' + $style.skeAnimation" />
        </div>
    </div>
</template>

<script>
import AddressItem from '../../components/item/Address-Item.vue'
import OrderItem from '../../components/item/Order-Item.vue'
import moment from 'moment'
import {
    confirmCart,
    submitOrder,
    submitOrderPay
} from '../../apis/shopping-cart'
import { getCouponOfMax, getCouponByPrice, getRedEnvelopeListByPrice } from '../../apis/my-coupon'
import { cancelOrder, deleteOrder } from '../../apis/order-manager'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { mapGetters, mapActions } from 'vuex'
import { STUDENTS } from '../../store/mutation-type'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import Count from '../../components/common/Count.vue'
import { checkLength, isPhone } from '../../assets/js/validate'
import { resetForm, setTimeoutSync } from '../../assets/js/util'
import { getServerTime } from '../../apis/base-api'
import StudentInline from './components/Student-Inline.vue'
import CustomInline from './components/Custom-Inline.vue'
import OtherInfo from './components/Other-Info.vue'
import InfoItem from './components/Info-Item.vue'
import CustomBlock from './components/Custom-Block.vue'
export default {
    name: 'SubmitOrder',
    components: {
        AddressItem,
        OrderItem,
        OrderItemSkeleton,
        AddressItemSkeleton,
        Count,
        StudentInline,
        OtherInfo,
        InfoItem,
        CustomInline,
        CustomBlock
    },
    data () {
        this.requestPayDataCount = 0
        return {
            showPopup: false,
            showContactPopup: false,
            submiting: false,
            loading: false,
            showCoupon: false,
            // 是否显示选择发票
            showInvoiceSelector: false,
            freight: 0,
            totalAmount: 0,
            physicalAmount: 0,
            // 优惠券信息
            coupon: {},
            // 优惠券信息
            couponList: [],
            physicalProducts: [],
            virtualProducts: [],
            lessonList: [],
            needStudentList: [],
            // 需要自定义表单的商品
            customList: [],
            // 单商品备注
            remark: '',
            // 物理订单备注
            physicalRemark: '',
            invioceType: 0,
            INVOICE_MODEL: {},
            CHECKED_STUDENT: {},
            rules: {
                name: [
                    { required: true, message: '请输入联系人姓名' },
                    { validator: checkLength(12), message: '联系人姓名为1~12个字符' }
                ],
                mobile: [
                    { required: true, message: '请输入联系人手机号' },
                    { validator: isPhone, message: '联系人手机号格式错误' }
                ]
            },
            contactInfoModel: {
                name: '',
                mobile: ''
            },
            contactInfoForm: {
                name: '',
                mobile: ''
            },
            detail: {},
            // 学员信息错误标记点
            lessonErrorId: '',
            // 学员信息错误标记点提示语
            lessonErrorTip: '',
            // 自定义表单错误信息点
            customErrorId: '',
            // 推荐使用的优惠券Id
            recommendCouponId: '',
            // 服务器时间
            serverTime: '',
            // 是否选择'不参与优惠'
            isNotChooseCoupon: false,
            showRedEnvelopePopup: false,
            // 红包列表
            redEnvelopeList: [],
            // 是否选择'不使用'红包, 默认选择不使用红包
            isNotChooseRedEnvelope: true,
            // 当前选中的红包
            currentRedEnvelope: {}
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList', 'realName', 'userName']),

        // 是否只有一个商品
        isAloneProduct () {
            return this.physicalProducts.length + this.virtualProducts.length + this.lessonList.length === 1
        },

        // 只有一个商品时，返回这个商品
        aloneProduct () {
            if (this.isAloneProduct) {
                return this.lessonList[0] || this.physicalProducts[0] || this.virtualProducts[0]
            }
            return null
        },
        isCart () {
            return this.$route.query.isCart === 'YES'
        },

        // 传入的活动类型
        activeProduct () {
            return Number(this.$route.query.activeProduct) || 1
        },

        // 传入的活动状态 2 为进行中
        preActivity () {
            return Number(this.$route.query.preActivity) || 1
        },
        activityId () {
            return this.$route.query.activityId || ''
        },

        // 实体商品原价总和
        physicalProductOriginalPrice () {
            const { activeProduct = 0 } = this
            if (activeProduct === 5 || activeProduct === 6) {
                return this.physicalProducts.map(item => (item.originPrice * 1000 * item.count) / 1000).reduce((total, num) => total + num)
            }
            return 0
        },

        // 实体商品现价总和
        physicalProductPrice () {
            return this.physicalProducts.map(item => (item.price * 1000 * item.count) / 1000).reduce((total, num) => total + num)
        }
    },
    watch: {
        selectedAddress: {
            handler (val) {
                // 地址变化时，如果已经选择了发票，且发票类型为个人，将改变发票信息为当前地址信息
                if (this.INVOICE_MODEL && this.INVOICE_MODEL.invoiceType === 1) {
                    this.INVOICE_MODEL.userAddressId = val.sequenceNbr
                    this.INVOICE_MODEL.receiverMobile = val.mobile
                    this.INVOICE_MODEL.invoiceTitle = val.realName
                    sessionStorage.setItem('INVOICE_MODEL', JSON.stringify(this.INVOICE_MODEL))
                }
            },
            deep: true
        },
        remark (val) {
            // 但是底部的备注绑定是共用的备注数据，所以，要将这个共用的备注数据写入到单独商品的备注字段中
            if (this.isAloneProduct) {
                this.aloneProduct.remark = val
            }
        }
    },
    async activated () {
        // TODO: 前方高能！！！！不熟悉下单逻辑的人勿动
        const {
            realName,
            userName,
            mobile
        } = this
        this.loading = true
        try {
            // 获取服务器时间
            const { result: serverTime } = await getServerTime()

            // 获取商品详情
            await this.getProductDetail()
            this.serverTime = Number(serverTime)

            // 选择的发票信息（如果有的话）
            this.INVOICE_MODEL = JSON.parse(sessionStorage.getItem('INVOICE_MODEL')) || null

            // 选择的学员信息（如果有的话）
            this.CHECKED_STUDENT = JSON.parse(sessionStorage.getItem('CHECKED_STUDENT')) || {}

            // 每个商品选择的学员信息是一个数组，为了保证这个数组正确的与商品对应起来，CHECKED_STUDENT对象的key都是商品的规格id组成
            const selectedStudents = Object.keys(this.CHECKED_STUDENT)

            // 获取全部学员列表
            const students = await this[STUDENTS]()

            // 找到默认学院
            const defStudent = students.find(item => item.defaultStatus === 1)

            // 如果有默认学员，则缓存默认学员，并自动显示
            if (defStudent) {
                for (const item of this.needStudentList) {
                    // 如果当前商品没有选择学生
                    if (selectedStudents.indexOf(item.skuCode1 + item.skuCode2) === -1) {
                        this.$set(this.CHECKED_STUDENT, item.skuCode1 + item.skuCode2, [defStudent])
                    }
                }
                sessionStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
            }
            this.invioceType = this.INVOICE_MODEL ? 1 : 0
            this.lessonErrorId = ''

            // 初始化联系人信息
            const contactModel = JSON.parse(localStorage.getItem('CONTACT_INFO_MODEL'))
            this.contactInfoModel = contactModel ? {
                name: contactModel.name || userName,
                mobile: contactModel.mobile || mobile
            } : {
                name: realName || userName,
                mobile
            }

            // 还原之前选择的优惠券信息 + 还原之前选择的红包信息
            const coupon = JSON.parse(sessionStorage.getItem('COUPON_INFO')) || null
            const scholarship = JSON.parse(sessionStorage.getItem('SCHOLARSHIP_INFO')) || null
            if (coupon) await this.couponClick(coupon.detail, coupon.isNotUse)
            if (scholarship) await this.redEnvelopeClick(scholarship.detail, scholarship.isNotUse)
        } catch (e) {
            this.$router.go(-1)
            throw e
        }
    },
    deactivated () {
        this.isNotChooseCoupon = false
        this.isNotChooseRedEnvelope = true
        this.redEnvelopeList = []
    },
    methods: {
        ...mapActions([STUDENTS]),

        /**
         * 活动商品详情以及支付价格
         * @param coupon {object} 当前使用的优惠券
         * @param redEnvelope {object} 红包列表
         */
        async getProductDetail (coupon = {}, redEnvelope = {}) {
            // TODO: 前方高能！！！！不熟悉下单逻辑的人勿动
            try {
                const proList = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
                if (this.activeProduct === 1 && !coupon.id && !this.isNotChooseCoupon) {
                    // 获取合适的优惠券
                    coupon = await this.getCouponByAmount(proList)
                    this.recommendCouponId = coupon.id
                }
                if (this.activeProduct === 1 && !redEnvelope.id) {
                    // 获取红包列表
                    redEnvelope = await this.getRedEnvelopeByAmount(proList)
                }
                if (!proList || !proList.length) {
                    return this.$router.replace({ name: 'Home' })
                }

                // 获取订单详细数据
                const { result } = await confirmCart({
                    activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                    activityId: this.activityId,
                    cartProducts: proList,
                    userCouponId: coupon.id || '',
                    scholarshipId: redEnvelope.id || '',
                    addressSeq: this.selectedAddress.sequenceNbr
                })
                const { amount, totalAmount, freight, physicalProducts, virtualProducts, formalClass, experienceClass, knowledgeCourse } = result

                // 为每个虚拟订单都添加备注字段
                for (const p of physicalProducts) {
                    p.remark = ''
                }
                for (const item of formalClass) {
                    item.type = 'FORMAL_CLASS'
                }
                for (const item of experienceClass) {
                    item.type = 'EXPERIENCE_CLASS'
                }
                for (const item of virtualProducts) {
                    item.type = 'VIRTUAL_GOODS'
                }
                for (const item of knowledgeCourse) {
                    item.type = 'KNOWLEDGE_COURSE'
                }
                this.detail = result
                this.physicalAmount = amount
                this.totalAmount = totalAmount
                this.freight = Number(freight)
                this.physicalProducts = physicalProducts
                this.virtualProducts = virtualProducts
                // 将先上课归到课程中
                this.lessonList = [...formalClass, ...experienceClass, ...knowledgeCourse]

                // 是否显示学员选择栏，只要有一个商品允许（item.needStudentInfo === 1）就显示
                this.needStudentList = [...formalClass, ...experienceClass, ...virtualProducts].filter(item => item.needStudentInfo === 1)
                this.customList = [...physicalProducts, ...formalClass, ...experienceClass, ...virtualProducts].filter(item => item.needStudentInfo === 2)

                // 是否显示发票选择栏，只要有一个商品允许（item.showInvoice === 1）就显示
                this.showInvoiceSelector = [...physicalProducts, ...virtualProducts, ...formalClass, ...experienceClass].some(item => item.showInvoice === 1)
                this.loading = false

                // 处理课程和虚拟商品中【预购】商品的使用时间
                for (const item of [...this.virtualProducts, ...this.lessonList]) {
                    if (this.activeProduct === 4 && this.preActivity === 2) {
                        item.validityPeriodStart = item.useStartTime
                        item.validityPeriodEnd = item.useEndTime
                    }
                }
            } catch (e) {
                throw e
            }
        },

        // 获取当前课程选择的学员数量
        getStudentCountByProId (proId) {
            const currentStudents = this.CHECKED_STUDENT[proId]
            if (currentStudents) {
                return currentStudents.length
            }
            return 0
        },
        selectStudent (product) {
            sessionStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
                name: this.$route.name,
                query: this.$route.query,
                params: this.$route.params
            }))
            this.$router.push({
                name: 'StudentList',
                query: {
                    select: 'YES',
                    sku: product.skuCode1 + product.skuCode2,
                    count: product.count
                }
            })
        },
        // 修改数量
        async countChange (count, pro, next) {
            const CONFIRM_LIST = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
            const thisPro = CONFIRM_LIST.find(item => item.productId === pro.productId)
            const thisStudents = this.CHECKED_STUDENT[pro.skuCode1 + pro.skuCode2]
            thisPro.count = count
            sessionStorage.setItem('CONFIRM_LIST', JSON.stringify(CONFIRM_LIST))
            try {
                await this.getProductDetail()
                next()
                if (thisStudents && count < thisStudents.length) {
                    thisStudents.pop()
                    sessionStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
                }
            } catch (e) {
                throw e
            }
        },
        selectInvoice () {
            if (!this.physicalProducts.length && !this.contactInfoModel.name) {
                this.$warning('请先填写联系人信息')
                return
            }
            this.showPopup = true
        },

        // 根据购买总价获取合适的优惠券
        async getCouponByAmount (proList = []) {
            // 获取优惠券信息
            const amount = proList.map(item => item.price * item.count).reduce((total, price) => total + price)
            const { result } = await getCouponOfMax({
                activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                activityId: this.activityId,
                cartProducts: proList,
                addressSeq: this.selectedAddress.sequenceNbr
            })
            if (this.activeProduct === 1) {
                await this.getCouponList(amount, {
                    activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                    activityId: this.activityId,
                    cartProducts: proList,
                    addressSeq: this.selectedAddress.sequenceNbr
                })
            }
            this.coupon = result

            // 当前选择的优惠券不支持使用奖学金时，置空选择的奖学金
            if (this.coupon.scholarship === 0) {
                this.currentRedEnvelope = {}
                this.isNotChooseRedEnvelope = true
            }
            return result
        },
        chooseContact () {
            this.contactInfoForm = Object.assign({}, this.contactInfoForm, this.contactInfoModel)
            this.showContactPopup = true
        },
        useContact () {
            if (this.$refs.contactForm.validate()) {
                this.showContactPopup = false
                this.contactInfoModel = Object.assign({}, this.contactInfoModel, this.contactInfoForm)
                localStorage.setItem('CONTACT_INFO_MODEL', JSON.stringify(this.contactInfoModel))
            }
        },

        // 选择优惠券
        async couponClick (item, isNotChooseCoupon) {
            this.coupon = item
            this.showCoupon = false
            this.isNotChooseCoupon = isNotChooseCoupon

            // 当前选择的优惠券不支持使用奖学金时，置空选择的奖学金
            if (this.coupon.scholarship === 0) {
                this.currentRedEnvelope = {}
                this.isNotChooseRedEnvelope = true
            }
            sessionStorage.setItem('COUPON_INFO', JSON.stringify({
                isNotUse: this.isNotChooseCoupon,
                detail: this.coupon
            }))
            sessionStorage.setItem('SCHOLARSHIP_INFO', JSON.stringify({
                isNotUse: this.isNotChooseRedEnvelope,
                detail: this.currentRedEnvelope
            }))
            await this.getProductDetail(item, this.currentRedEnvelope)
        },

        // 获取优惠券
        async getCouponList (amount, data) {
            try {
                const { result } = await getCouponByPrice(data)
                const { serverTime } = this
                this.couponList = result.map(item => {
                    const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                    const day = Math.floor(moment.duration(duration).asDays())
                    item.timeDesc = ''
                    if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                    return item
                })
            } catch (e) {
                throw e
            }
        },

        // 是否显示红包选择框
        showRedEnvelopePopupClick () {
            if (!this.redEnvelopeList.length) {
                return this.$warning('无可用奖学金')
            }

            // 可否与奖学金混合使用 scholarship 0-不使用 1-可使用
            if (this.coupon.scholarship === 0) {
                return this.$warning('该优惠券不支持与奖学金叠加使用')
            }
            this.showRedEnvelopePopup = true
        },

        // 根据购买总价获取合适的红包
        async getRedEnvelopeByAmount (proList = []) {
            // 获取优惠券信息
            const amount = proList.map(item => item.price * item.count).reduce((total, price) => total + price)

            // 只有普通商品支持使用红包
            if (this.activeProduct === 1) {
                await this.getRedEnvelopeList(amount)
            }
            this.currentRedEnvelope = {}
            return {}
        },

        // 获取红包列表
        async getRedEnvelopeList (amount) {
            try {
                const { result } = await getRedEnvelopeListByPrice(amount)
                const { serverTime } = this
                this.redEnvelopeList = result.map(item => {
                    const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                    const day = Math.floor(moment.duration(duration).asDays())
                    item.timeDesc = ''
                    if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                    return item
                })
            } catch (e) {
                throw e
            }
        },

        // 选择红包
        async redEnvelopeClick (item, isNotChooseRedEnvelope) {
            this.currentRedEnvelope = item
            this.showRedEnvelopePopup = false
            this.isNotChooseRedEnvelope = isNotChooseRedEnvelope
            sessionStorage.setItem('COUPON_INFO', JSON.stringify({
                isNotUse: this.isNotChooseCoupon,
                detail: this.coupon
            }))
            sessionStorage.setItem('SCHOLARSHIP_INFO', JSON.stringify({
                isNotUse: this.isNotChooseRedEnvelope,
                detail: this.currentRedEnvelope
            }))
            await this.getProductDetail(this.coupon, item)
        },

        /**
         * 判断是否选择了学生
         * @param needStudent {Number} 是否需要学员
         * @param currentStudent {Array} 已选学生列表或者自定义列表
         * @param skuCode1 {string} 规格1的id，作为每个单独商品学员数据存储的key
         * @param count {Number} 商品数量，用来判断学生数量
         */
        hasStudents (needStudent, currentStudent, skuCode1, count) {
            if (needStudent === 1 && !currentStudent) {
                if (this.isCart) {
                    this.lessonErrorId = skuCode1
                    this.lessonErrorTip = '请选择学员信息'
                }
                this.$error('请选择学员信息')
                return false
            }
            if (needStudent === 1 && currentStudent && currentStudent.length < count) {
                if (this.isCart) {
                    this.lessonErrorId = skuCode1
                    this.lessonErrorTip = `请选择${ count }名学员信息`
                }
                this.$error(`请选择${ count }名学员信息`)
                return false
            }
            return true
        },

        /**
         * 判断是否填写了自定义表单
         * @property needStudentInfo {Number} 是否需要学员
         * @property customForm {Array} 当前商品的自定义表单
         * @property productId {string} 规格
         * @property productType {string} 商品类型
         * @property fields {Array} 字段列表
         */
        hasCustomForm ({ needStudentInfo, customForm, productId, fields, productType }) {
            // console.log(needStudentInfo, customForm, productId, fields, productType)
            if (needStudentInfo === 2) {
                if (!customForm || !customForm.length) {
                    if (productType === 'PHYSICAL_GOODS') {
                        this.$error('请填写所有用户信息')
                    } else {
                        this.$error('请填写所有学员信息')
                    }
                    this.customErrorId = productId
                    return false
                }
                for (const form of customForm) {
                    for (const field of form) {
                        if (field.required && !field.fieldValue) {
                            if (productType === 'PHYSICAL_GOODS') {
                                this.$error('请填写所有用户信息')
                            } else {
                                this.$error('请填写所有学员信息')
                            }
                            this.customErrorId = productId
                            return false
                        }
                    }
                }
            }
            return true
        },

        // 提交订单
        async submitOrder () {
            const cartProducts = []
            if (this.physicalProducts.length > 0 && this.addressList <= 0) {
                this.$confirm('您还没有收货地址，请先添加收货地址')
                    .then(() => {
                        this.$refs.addAddressItem.addAddress()
                    })
                return
            }
            for (const item of this.physicalProducts) {
                const { productId, skuCode1, skuCode2, count, agentUser, customForm, needStudentInfo, formEntityList } = item

                // 实体商品不考虑商品数量，所有count传0
                if (!this.hasCustomForm({ needStudentInfo, customForm: customForm || [], productId, fields: formEntityList, productType: 'PHYSICAL_GOODS' })) return
                cartProducts.push({
                    productId,
                    skuCode1,
                    skuCode2,
                    productType: 'PHYSICAL_GOODS',
                    count,
                    agentUser,
                    customForm: customForm || [],
                    message: this.physicalRemark || this.remark
                })
            }
            for (const item of this.virtualProducts) {
                const { productId, skuCode1, skuCode2, count, agentUser, remark = this.remark, needStudentInfo, customForm, formEntityList } = item
                const currentStudent = this.CHECKED_STUDENT[skuCode1 + skuCode2]
                if (!this.hasStudents(needStudentInfo, currentStudent, skuCode1, count)) return
                if (!this.hasCustomForm({ needStudentInfo, customForm: customForm || [], productId, fields: formEntityList })) return
                cartProducts.push({
                    productId,
                    skuCode1,
                    skuCode2,
                    productType: 'VIRTUAL_GOODS',
                    count,
                    agentUser,
                    message: remark,
                    customForm: customForm || [],
                    studentIds: needStudentInfo === 1 ? this.CHECKED_STUDENT[skuCode1 + skuCode2].map(item => item.id) : null
                })
            }
            for (const item of this.lessonList) {
                const { productId, skuCode1, skuCode2, count, agentUser, remark = this.remark, needStudentInfo, customForm = [], formEntityList } = item
                const currentStudent = this.CHECKED_STUDENT[skuCode1 + skuCode2]
                if (!this.hasStudents(needStudentInfo, currentStudent, skuCode1, count)) return
                if (!this.hasCustomForm({ needStudentInfo, customForm: customForm || [], productId, fields: formEntityList })) return
                cartProducts.push({
                    productId,
                    skuCode1,
                    skuCode2,
                    productType: item.type,
                    studentIds: needStudentInfo === 1 ? this.CHECKED_STUDENT[skuCode1 + skuCode2].map(item => item.id) : null,
                    count,
                    agentUser,
                    customForm: customForm || [],
                    message: remark
                })
            }

            // contactInfoModel
            const data = {
                addressSeq: this.physicalProducts.length > 0 ? this.selectedAddress.sequenceNbr : '',
                cartProducts,
                cartSource: this.isCart,
                invoiceModel: this.INVOICE_MODEL,
                activeProduct: this.activeProduct || 1,
                activityId: this.activityId,
                userCouponId: this.coupon.id || '',
                scholarshipId: this.currentRedEnvelope.id || ''
            }
            if (this.physicalProducts.length === 0) {
                // 没有实体商品时，必须有联系人信息
                if (!this.contactInfoModel.name || !this.contactInfoModel.mobile) {
                    this.$warning('请填写联系人信息')
                    return
                }
                data.contactInfoModel = this.contactInfoModel
            }
            try {
                this.submiting = true
                const { result: orderSn } = await submitOrder(data)
                await this.requestPayData(orderSn)
            } catch (e) {
                if (e.message !== '取消支付') {
                    throw e
                }
            } finally {
                this.requestPayDataCount = 0
                this.submiting = false
            }
        },
        async requestPayData (orderSn) {
            // 每500ms请求一次支付数据，如果请求次数超过20次，就终止请求
            // 下次请求的开始时间 =  500ms + 当前请求时间
            if (this.requestPayDataCount >= 20) {
                this.requestPayDataCount = 0
                this.submiting = false
                this.$error('支付失败')
                return
            }
            await setTimeoutSync(500)
            try {
                // 如果没有拿到请求数据，再次尝试发起请求
                // 如果有，则发起支付
                const { result: payData } = await submitOrderPay(orderSn)
                if (!payData) {
                    this.requestPayDataCount++
                    await this.requestPayData(orderSn)
                } else {
                    await this.pay(payData, payData.orderLists, payData.orderLists.length)
                }
            } catch (e) {
                this.requestPayDataCount = 0
                this.submiting = false
                throw e
            }
        },

        /**
         * 支付
         * @param CREDENTIAL {Object} 支付数据
         * @param orderIds {Array} 订单Id
         * @param orderCount {Number} 订单数量
         * @returns {Promise<*>}
         */
        async pay (CREDENTIAL, orderIds, orderCount) {
            const firstOrder = orderIds[0]
            let orderType = ''
            if (this.lessonList.length > 0 && this.physicalProducts.length === 0 && this.virtualProducts.length === 0) {
                orderType = 'FORMAL_CLASS'
            }
            try {
                if (CREDENTIAL.appId) {
                    await wechatPay(CREDENTIAL)
                }
                this.submiting = false
                this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount }, query: { orderType, productType: this.productType } })
                sessionStorage.removeItem('INVOICE_MODEL')
                sessionStorage.removeItem('CONFIRM_LIST')
                this.submiting = false
            } catch (e) {
                // 支付失败
                // let vLen = this.virtualProducts.length
                // let pLen = this.physicalProducts.length
                // TODO: 由于现在没有二次支付，所以支付失败的时候，直接取消订单并删除
                try {
                    const allCancel = []
                    const allDelete = []
                    for (const id of orderIds) {
                        allCancel.push(cancelOrder(id, '支付失败'))
                        allDelete.push(deleteOrder(id))
                    }
                    await Promise.all(allCancel)
                    await Promise.all(allDelete)
                } catch (e) {
                    console.warn('订单取消失败')
                    console.error(e)
                }

                // 按需跳转页面
                // if (vLen > 1 || (pLen > 1 && vLen > 0)) {
                // TODO: 如果有二次支付，应该跳转至待支付列表
                // this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
                // this.$router.replace({ name: 'Orders', params: { status: 'ALL_ORDER' } })
                // } else {
                // 只有一种商品时，直接进入详情页
                // this.$router.replace({ name: 'OrderDetail', params: { orderId: firstOrder } })
                // }
                // sessionStorage.removeItem('INVOICE_MODEL')
                // sessionStorage.removeItem('CONFIRM_LIST')
                this.submiting = false
                throw e
            }
        },
        noNeed () {
            this.invioceType = 0
            this.showPopup = false
            sessionStorage.removeItem('INVOICE_MODEL')
        },

        // 需要发票
        need () {
            const applyInvoice = [
                ...this.physicalProducts.filter(item => item.price !== 0 && item.showInvoice === 1),
                ...this.virtualProducts.filter(item => item.price !== 0 && item.showInvoice === 1),
                ...this.lessonList.filter(item => item.price !== 0 && item.showInvoice === 1)
            ]
            sessionStorage.setItem('APPLY_INVOICE', JSON.stringify(applyInvoice))
            sessionStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify({
                name: this.$route.name,
                params: this.$route.params,
                query: this.$route.query
            }))
            if (this.contactInfoModel.mobile) {
                this.$router.push({
                    name: 'ApplyInvoice',
                    query: {
                        receiveMobile: this.contactInfoModel.mobile,
                        receiveName: this.contactInfoModel.name
                    }
                })
            } else {
                this.$router.push({ name: 'ApplyInvoice' })
            }
            this.showPopup = false
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'ApplyInvoice' &&
      to.name !== 'Address' &&
      to.name !== 'AddAddress' &&
      to.name !== 'StudentList') {
            sessionStorage.removeItem('INVOICE_MODEL')
            sessionStorage.removeItem('CONFIRM_LIST')
            sessionStorage.removeItem('APPLY_INVOICE')
            sessionStorage.removeItem('CHECKED_STUDENT')
            sessionStorage.removeItem('COUPON_INFO')
            sessionStorage.removeItem('SCHOLARSHIP_INFO')
            localStorage.removeItem('CONTACT_INFO_MODEL')
            this.remark = ''
            this.physicalProducts = []
            this.virtualProducts = []
            this.invioceType = 1
            this.INVOICE_MODEL = {}
            this.CHECKED_STUDENT = {}
            resetForm(this.contactInfoModel)
            resetForm(this.contactInfoForm)
        }
        next()
    }
}
</script>

<style module lang="scss">
  .submitOrder {
    padding: 20px 24px 120px;
  }
  .productBox {
    width: 100%;
    margin: 0 0 20px 0;
    padding: 32px 0 24px 0;
    border-radius: $--radius1;
    background-color: #fff;
    box-sizing: border-box;
    .orderItemBox {
      padding: 0 24px;
    }
  }
  .edit-count {
    display: flex;
    align-items: center;
    > span {
      margin-right: 16px;
      font-size: 20px;
      color: #999;
    }
  }
  .remark {
    flex: 1;
    height: 100%;
    padding: 0;
    margin-left: 22px;
    font-size: 24px;
    text-align: right;
  }
  .address {
    margin-bottom: 28px;
    background-color: #fff;
  }
  .product, .remark {
    padding: 24px 28px 18px;
    background-color: #fff;
  }
  .orderTop {
    position: relative;
    font-size: 28px;
    font-weight: bold;
    padding-bottom: 22px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e7e7e7;
  }
  .money {
    position: relative;
    padding: 22px 0;
    border-bottom: 1px solid #e7e7e7;
    > p {
      display: flex;
      justify-content: space-between;
      line-height: 52px;
      &:nth-of-type(2) > span:nth-of-type(2) {
        color: $--primary-color;
      }
    }
  }
  .item-selector {
    margin-bottom: 20px;
    padding-left: 24px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
  }
  .invioceBox {
    .title {
      position: relative;
      height: 114px;
      line-height: 114px;
      font-size: 36px;
      padding: 0 40px;
      border-bottom: 1px solid #e7e7e7;
    }
    .content {
      padding: 62px 40px;
      > button {
        width: 100%;
        height: 88px;
        margin-bottom: 28px;
        font-size: 32px;
        color: #387AF6;
        font-weight: 500;
        background-color: #F1F0F7;
        border-radius: $--radius2;
      }
    }
  }

  .total-money {
    line-height: 66px;
    text-align: right;
    > span:nth-of-type(2) {
      color: $--primary-color;
    }
  }
  .confirm {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 24px;
    height: 110px;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 2;
    > div {
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      min-width: 200px;
    }
  }
  .oneProductMark {
    display: flex;
    margin-top: 20px;
    padding: 0 28px;
    line-height: 88px;
    font-size: 28px;
    background-color: #fff;
    border-radius: 20px;
    > input {
      flex: 1;
      margin-left: 68px;
      background-color: transparent;
    }
  }
  .student-list {
    background-color: #fff;
    padding-right: 24px;
    .student-item {
      padding: 24px 0;
      font-size: 28px;
      line-height: 40px;
      border-bottom: 1px solid #e7e7e7;
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
      > .student-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 26px;
      }
      > .student-phone {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .contact-detail {
    padding: 24px 0;
    > span:nth-of-type(1) {
      margin-right: 24px;
      font-weight: 500;
    }
  }
  .add-contact {
    padding: 40px 20px;
    .add-contact-top {
      margin-bottom: 20px;
      font-size: 40px;
      color: #000;
    }
    button {
      margin-top: 48px;
    }
    label {
      background-color: #f9f9f9 !important;
      padding-left: 32px;
      span {
        color: #999 !important;
      }
    }
  }

  .coupon {
    padding: 0 24px;
    > .coupon-list {
      margin-top: 48px;
      padding-bottom: 40px;

      .coupon-item {
        height: 72px;
        line-height: 72px;
        position: relative;
        overflow: hidden;
        font-size: 24px;

        .button {
          display: inline-block;
          width: 120px;
          height: 40px;
          border: 2px solid #F2B036;
          border-radius: 8px;
          line-height: 40px;
          color: #F2B036;
          text-align: center;
          margin-top: 10px;
          float: left;
        }

        .full {
          display: inline-block;
          font-size: 28px;
          color: #373737;
          float: left;
          margin-left: 20px;
        }

        .time-desc {
          display: inline-block;
          color: #B5B5B5;
          float: left;
          margin-left: 20px;
        }
        .recommend {
          color:#FE0D0D;
          margin-left: 20px;
        }
        .choices {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          >svg {
            vertical-align: middle;
          }
        }
        .not-choose-coupon{
          font-size:28px;
          line-height: 72px;
          color:#C1C1C1;
        }
      }
    }
  }

  .red-envelope {
    padding: 0 24px;
    >.red-envelope-list {
      margin-top: 20px;
      padding-bottom: 40px;
      .red-envelope-item {
        height: 60px;
        line-height: 60px;
        position: relative;

        .count {
          margin-left: 24px;
          font-size:32px;
          color:#373737;
        }
        .is-over {
          margin-left: 20px;
          font-size:24px;
          color:#999999;
        }
        .choices {
          line-height: 0;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .not-choose-red-envelope {
          font-size:28px;
          line-height: 72px;
          color:#C1C1C1;
        }
      }
      svg {
        vertical-align: text-bottom;
      }
    }
  }

  .skeleton {
    padding: 20px 40px;
  }
  .skeleton1 {
    background-color: #fff;
  }
  .skeleton2 {
    margin-top: 28px;
    padding: 20px 28px;
    background-color: #fff;
  }
  .skeleton2-1 {
    width: 112px;
    height: 37px;
  }
  .skeleton2-2 {
    width: 122px;
    height: 37px;
    margin-top: 23px;
  }
  .skeleton2-3 {
    width: 112px;
    height: 37px;
    margin-top: 13px;
  }
  .skeleton2-4 {
    width: 150px;
    height: 37px;
    margin-top: 28px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
