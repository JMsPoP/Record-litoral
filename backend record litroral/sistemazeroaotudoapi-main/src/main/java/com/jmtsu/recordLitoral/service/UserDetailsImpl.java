package com.jmtsu.recordLitoral.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.jmtsu.recordLitoral.models.UserModel;
import com.jmtsu.recordLitoral.models.enums.RolesUser;
import com.jmtsu.recordLitoral.models.enums.SituacaoUsuario;

public class UserDetailsImpl implements UserDetails {

    private Long id;
    
    private String name;
    
    private String username;
    
    private String email;
    
    private String password;
    
    private GrantedAuthority authority;
    
    private SituacaoUsuario situacao;

    public UserDetailsImpl(Long id, String name, String username, String password, String email, RolesUser role, SituacaoUsuario situacao) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.authority = new SimpleGrantedAuthority("ROLE_" + role.toString());
        this.situacao = situacao;
    }

    public static UserDetailsImpl build(UserModel usuario) {
        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getNome(),
                usuario.getLogin(),
                usuario.getSenha(),
                usuario.getEmail(),
                usuario.getRoles(),
                usuario.getSituacao()
        );
    }

    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(authority);
    }

    
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    
    
    @Override
    public boolean isEnabled() {
        return situacao == SituacaoUsuario.ATIVO;
    }

    public SituacaoUsuario getSituacao() {
        return situacao;
    }
}
