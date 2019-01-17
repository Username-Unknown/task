var data=[//文件夹存于数组
    {//第一级 , 文件夹
        "name":"默认",
        'value':[]
    },
    {//第一级 , 文件夹
        "name":"ifeproject",//文件夹名字
        "value":[//文件存于数组
            {//第二级文件
                "name":"文件名",
                "value":[
                    {//第三级别 日期
                        "name":"2019-1-15",
                        "value":[
                            {
                                "name":"todo1",
                                "done":true,
                                "value":"完成编码工作"
                            },
                            {
                                "name":"todo2",
                                "done":true,
                                "value":"继续完成"
                            },
                            {   
                                "name":"todo3",
                                "done":false,
                                "value":"继续完成"
                            }
                        ]
                    },
                    {
                        "name":"2019-1-16",
                        "value":[
                            {
                                "name":"todo1",
                                "done":false,
                                "value":"没有完成"
                            }
                        ]
                    }
                ]
            },
        ]
    }
]
var storage=window.localStorage;
storage['project']=JSON.stringify(data);