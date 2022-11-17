let CTYPE = (() => {

    return {
        page_limit: 20,

        topBars: [
            {title: '全部', type: 0},
            {title: '待付款', type: 1},
            {title: '待发货', type: 2},
            {title: '待收货', type: 3},
            {title: '已完成', type: 6}
        ],

        bannerTypes: {
            banner: Symbol('banner'),
            ad: Symbol('ad'),
            product: Symbol('product')
        },

        productLayout: {
            box: Symbol('box'),
            flat: Symbol('flat')
        },

        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
            rectangle_ad: 0.29
        },

        imgeditorscaleCourse: {
            square: 0.57,
            rectangle_v: 1,
            rectangle_h: 1,
            rectangle_ad: 0.29
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },
        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },


        specs: ['30mmX40mm', '35mmX50mm']

    };

})();

export default CTYPE;
