package com.sky.controller.user;

import com.sky.constant.JwtClaimsConstant;
import com.sky.entity.User;
import com.sky.mapper.UserMapper;
import com.sky.properties.JwtProperties;
import com.sky.result.Result;
import com.sky.utils.JwtUtil;
import com.sky.vo.UserLoginVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 本地联调专用的“免微信”登录入口。
 *
 * <p>说明：正式的 C 端登录依赖微信 code2session，需要真实的 appid / appsecret
 * 以及微信开发者工具环境，本地前后端联调时无法完成。该控制器仅在 dev
 * profile 下生效（application.yml 中 sky.profiles.active=dev），
 * 用固定 openid 建立一个本地测试用户并签发正常格式的用户端 JWT，
 * 使 /user/** 下的购物车、地址、下单等接口可以在本地走通。
 *
 * <p>生产环境（非 dev profile）不会加载此类，接口不存在。
 */
@RestController("devUserController")
@RequestMapping("/user/user")
@Api(tags = "C端用户相关接口（本地联调）")
@Slf4j
@Profile("dev")
public class DevUserController {

    /**
     * 本地测试用户使用的固定 openid，与真实微信用户隔离
     */
    private static final String DEV_OPENID = "dev-local-openid";

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JwtProperties jwtProperties;

    /**
     * 本地联调登录：无需微信授权，直接返回测试用户令牌
     *
     * @return 与微信登录一致结构的登录结果
     */
    @PostMapping("/dev-login")
    @ApiOperation("本地联调登录（免微信授权）")
    public Result<UserLoginVO> devLogin() {
        User user = userMapper.getByOpenid(DEV_OPENID);
        if (user == null) {
            user = User.builder()
                    .openid(DEV_OPENID)
                    .name("本地测试用户")
                    .createTime(LocalDateTime.now())
                    .build();
            userMapper.insert(user);
            log.info("已创建本地联调测试用户，id={}", user.getId());
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID, user.getId());
        String token = JwtUtil.createJWT(jwtProperties.getUserSecretKey(), jwtProperties.getUserTtl(), claims);

        return Result.success(UserLoginVO.builder()
                .id(user.getId())
                .openid(user.getOpenid())
                .token(token)
                .build());
    }
}
