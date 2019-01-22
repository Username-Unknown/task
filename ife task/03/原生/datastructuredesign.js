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
                            {
                                "name":"todo1",
                                "done":1,
                                "date":"2019-2-11",
                                "value":"完成编码工作"
                            },
                            {
                                "name":"todo2",
                                "done":1,
                                "date":"2019-2-11",
                                "value":"继续完成"
                            },
                            {   
                                "name":"todo3",
                                "done":-1,
                                "date":"2019-2-12",
                                "value":"继续完成"
                            }
                        ]
            }
        ]
    }
]

var storage=window.localStorage;
storage['project']=JSON.stringify(data);