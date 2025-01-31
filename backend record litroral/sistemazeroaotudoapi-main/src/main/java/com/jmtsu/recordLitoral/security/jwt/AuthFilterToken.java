package com.jmtsu.recordLitoral.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jmtsu.recordLitoral.service.UserDetailServiceImpl;
import com.jmtsu.recordLitoral.service.UserDetailsImpl;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthFilterToken extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtil;
    
    @Autowired
    private UserDetailServiceImpl userDetailService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getToken(request);
            
            if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                String username = jwtUtil.getUsernameToken(jwt);
                UserDetailsImpl userDetails = (UserDetailsImpl) userDetailService.loadUserByUsername(username);
                
                if (isAllowedEndpoint(request, userDetails.getSituacao())) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Acesso negado");
                    return;
                }
            }
            
        } catch (Exception e) {
            System.out.println("Ocorreu um erro ao processar o token: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getToken(HttpServletRequest request) {
        String headerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(headerToken) && headerToken.startsWith("Bearer")) {
            return headerToken.replace("Bearer ", "");
        }
        
        return null;
    }
    
    
    
    private boolean isAllowedEndpoint(HttpServletRequest request, SituacaoUsuario situacao) {
        String path = request.getRequestURI();
        
        if (situacao == SituacaoUsuario.PENDENTE) {
            return path.startsWith("/auth/signup") || path.startsWith("/auth/verify");
        } else if (situacao == SituacaoUsuario.ATIVO) {
            return true;
        } else {
            return false;
        }
    }
}
